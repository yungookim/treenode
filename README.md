HTML Tree Assembler based on node.js
===

(experimental idea)

Given a meta-template which structures a HTML page in tree structure, fetch contents from local/remote service which only generates portion of HTML.


## Example (rough sketch)

	
	{ 'Document' :
	 [
	  {'Head' : { 'type' : 'http', 'url' : '192.1.1.10/gethead', 'insertHeader' : 1, 'insertPost' : 0 }
	  {'Body' : { 'type' : 'http', 'url' : '192.2.1.10/getbody', 'insertHeader' : 0, 'insertPost' : 1 }
	  {'Footer' : { 'type' : 'memcached', 'server': '192.5.5.0', 'key' : 'footer_version_2.1' }
	  {'Footer2' : { 'type' : 'local', 'path' : '/treenode/files/somefile' }
	 ],
	 'prepend' : '<html>',
	 'append' : '</html>'
	}

Then,

- 192.1.1.10/gethead produces `<head>blah</head>`
- 192.2.1.10/getbody produces `<body>hello</body>`
- Memcached server at 192.5.5.0 returns value for key `footer_version_2.1`
- Reads from local file `/treenode/files/somefile`

After that, the treenode will simply concat the result and return.

If there was an error(or didn't respond within X sec), template should define how to resolve it.
Such as just ignore it, display alternertive text(error box, place holder), or just refuse to render whole thing and redirect to err page.
	
