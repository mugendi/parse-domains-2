/**
 * Copyright (c) 2022 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const axios = require('axios'),
	path = require('path'),
	fs = require('fs');

const suffixListURL = 'https://publicsuffix.org/list/public_suffix_list.dat';
const msPerDay = 86400000;
let suffixes = {};

function expired(time) {
	if (!time) return true;
	let elapsedTime = Date.now() - time;
	return msPerDay < elapsedTime;
}

/**
 * This method fetches all suffixes from a file lodally saved in the ./data directory
 * Or fetches an parses a new file from publicsuffix.org
 * @returns Array
 */
async function get_suffixes() {
	try {
		// if we have already loaded suffixes
		if (suffixes.loaded && !expired(suffixes.loaded)) {
			return suffixes;
		}

		let dataDir = path.join(__dirname, 'data');
		// ensure directory
		if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
		// check if we have the list in json format
		let listPath = path.join(dataDir, 'suffixes.json');
		if (fs.existsSync(listPath)) {
			// according to https://publicsuffix.org/list/
			// we should technically only update this list once a day
			// so we check how old ours is
			let savedAt = Math.ceil(fs.statSync(listPath).ctimeMs);

			// see if list is still valid
			// that is not older than a day
			if (!expired(savedAt)) {
				// then this is the list we must read and return
				let data = fs.readFileSync(listPath);
				// parse json
				suffixes.data = JSON.parse(data);
				suffixes.loaded = Date.now();

				// console.log('Returned existing valid file');
				if (Object.keys(suffixes.data).length > 0) {
					return suffixes;
				}
			}
		}

		// if we got here, we just need to fetch and replace list
		let { data } = await axios.get(suffixListURL);

		// format,
		let suffixesData = data
			.split(/\n/)
			// trim
			.map((str) => str.trim())
			// remove comments and lines without actual suffixes
			.filter(
				(str) =>
					/^\/\//.test(str) === false &&
					/^[^\.]+$/.test(str) === false
			)
			// remove blank lines
			.filter((str) => str.length > 0)
			.map((s) => ({ [s]: 0 }))
			.reduce((a, b) => Object.assign(a, b), {});

		fs.writeFileSync(listPath, JSON.stringify(suffixesData));

		// return the suffixes
		return { data: suffixesData };
	} catch (error) {
		throw error;
	}
}

/**
 * This is the main function that does all the work
 *  Takes in a query in the form of a URL, domain name and so on
 *
 * @param {*} query
 * @return {*}
 */
async function parse_domains(query) {
	try {
		let { data: suffixObj } = await get_suffixes();

		// in order to parse with new URL, we must ensure our query is a valid url
		// 1. trim
		query = query.trim();

		// 2. Replace any url starting with //
		query = query.replace(/^\/+/, '');

		// 3. Add protocol if missing
		if (/^https?:\/\//.test(query) === false) {
			query = `http://${query}`;
		}

		// noe get the hostname...
		let urlObj = new URL(query);

		let arr = urlObj.hostname.split('.');
		let suffix,
			suffixArr = [];

		let tld = null;

		while (arr.length > 0) {
			suffixArr.unshift(arr.pop());
			suffix = suffixArr.join('.');

			if (suffixObj[suffix] !== undefined) {
				tld = suffix;
			}
		}

		if (!tld) {
			tld = urlObj.hostname.split('.').pop();
		}

		let hostnameWithoutTld = urlObj.hostname
			.replace(tld, '')
			.replace(/\.$/, '');

		// pick site name
		let siteName = hostnameWithoutTld.split(/[\.\/]/).pop();

		// now compose domain
		let domain = siteName + '.' + tld;

		// any subdomains
		let subdomain = urlObj.hostname
			.replace(domain, '')
			.split('.')
			.filter((s) => s.length > 0)
			.join('.');

		return {
			tld,
			domain,
			subdomain,
			siteName,
			href: urlObj.href,
			hostname: urlObj.hostname,
			protocol: urlObj.protocol,
		};

		// console.log(suffixes);
	} catch (error) {
		throw error;
	}
}

module.exports = parse_domains;
