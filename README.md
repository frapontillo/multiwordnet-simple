MultiWordNet-Simple
===================

A fork of the original [MultiWordNet](http://multiwordnet.fbk.eu/english/home.php) adapted to SQLite3 databases and 
text files.

## What's included

For now, only lemma-to-synset English and Italian tables are included (that is, `english_index` and `italian_index`) as 
a SQLite3 database (under the `db` directory) and as text files (under the `out` directory).

The MultiWordNet page [claims](http://multiwordnet.fbk.eu/english/home.php) that Wordnets for Spanish, Portuguese, 
Hebrew, Romanian and Latin are available through different providers, but I haven't been able to find any downloadable
Wordnets anywhere (e.g., the [Portuguese WordNet](http://catalog.elra.info/product_info.php?products_id=1101) is not
free nor open source).

If you own any of MultiWordNet-compatible Wordnets and wish to make them available on this repository as well, please 
contact me.

## Motivations

Having to rely on a MySQL instance for simple lemma-to-synset lookups wasn't very much convenient... 
So there, you're welcome.

## Data export

The original MultiWordNet MySQL queries were manually processed to be standard SQL and to be acceptable for SQLite3.
Then, running `node index.js` will build a SQLite3 database (`db/multiwordnet-simple.db3`). Please note that the 
database creation process may take a while; if the database already exists it won't be recreated but it will simply be
opened.

Then, all of the index rows from every table will get exported into `out/LANG_index`, where `LANG` is the generic 
language defining a source table.

## <img src="http://mirrors.creativecommons.org/presskit/icons/by.large.png" height="20px"/> MultiWordNet License

MultiWordNet is licensed under a Creative Commons Attribution 3.0 Unported License.

## MultiWordNet-Simple License

This fork is licensed under the Apache 2.0 License.

```
   Copyright 2015 Francesco Pontillo

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```