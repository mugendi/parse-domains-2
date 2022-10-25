<!--
 Copyright (c) 2022 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Parse Domains

[![NPM](https://nodei.co/npm/parse-domains.png?downloads=true&downloadRank=true)](https://nodei.co/npm/parse-domains/)

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![github-package.json-version](https://img.shields.io/github/package-json/v/mugendi/parse-domains-2?style=social&logo=github)](https://github.com/mugendi/parse-domains-2)
[![github-top-lang](https://img.shields.io/github/languages/top/mugendi/parse-domains-2?style=social&logo=github)](https://github.com/mugendi/parse-domains-2)

This module is a complete rewrite of [parse-domains version 1.x.x](https://www.npmjs.com/package/parse-domains/v/1.0.2) in order to make use of Mozilla's fantastic [publicsuffix list](https://publicsuffix.org/list).

It was written while benchmarking against [tldts](https://github.com/remusao/tldts) which is super fast but has to be updated with every new suffix added to the public suffix list.

Instead, this module automatically **downloads the public list once a day** only as recommended by [publicsuffix.org](https://publicsuffix.org/list/). The new list is then **loaded to memory once** to keep the library super fast.

Generally, parsing most domains takes less than one millisecond. While not as fast as tldts, it parses in 1ms or less and you will never have to upgrade the module to a higher version just to get the latest suffixes.

## Usage

```javascript
async () => {
	let parse = require('parse-domains');
  // notice this method returns a promise
  // So either use the async/await pattern or the Promise.then pattern
	let resp = await parse('http://www.google.co.uk');
	console.log(resp);
};
```

This will log:

```
{
  tld: 'co.uk',
  domain: 'google.co.uk',
  subdomain: 'www',
  siteName: 'google',
  href: 'http://www.google.co.uk/',
  hostname: 'www.google.co.uk',
  protocol: 'http:'
}
```
