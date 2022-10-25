/**
 * Copyright (c) 2022 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let getDomain = require('..');

test('test google.com', async () => {
	let query = 'https://www.google.com/search?q=node+difference+between';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('google.com');
});

test('test google.com subdomain', async () => {
	let query = 'fonts.google.com/';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('google.com');
});

test('test stackoverflow.com', async () => {
	let query = 'https://stackoverflow.com/questions/11401897/get-the-current-domain-name-with-javascript-not-the-path-etc';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('stackoverflow.com');
});

test('test starting with www.', async () => {
	let query = 'www.fonts.google.com/';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('google.com');
});

// common suffixes
test('test .co.uk suffix', async () => {
	let query = 'google.co.uk';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('google.co.uk');
});

test('test .co.ke suffix', async () => {
	let query = 'www.my-fantastic-site.co.ke/this/and/that/page';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('my-fantastic-site.co.ke');
});

test('test chirurgiens-dentistes.fr suffix', async () => {
	// real site btw
	let query = 'https://dr-baudelot-olivier.chirurgiens-dentistes.fr/';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('dr-baudelot-olivier.chirurgiens-dentistes.fr');
});



// More difficult tests
test('test un trimmed entry', async () => {
	let query = '  google.com ';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('google.com');
});

test('test *.ck suffix', async () => {
	let query = 'en.wikipedia.org/wiki/.ck';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('wikipedia.org');
});

test('test *.bd suffix', async () => {
	let query = 'https://en.wikipedia.org/wiki/.bd';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('wikipedia.org');
});

test('test starting with //', async () => {
	let query = '//bad-url.com';
	let resp = await getDomain(query);
	expect(resp.domain).toBe('bad-url.com');
});



