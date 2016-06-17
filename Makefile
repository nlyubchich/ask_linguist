run:
	vagga run
test:
	vagga -eDISPLAY -eDBUS_SESSION_BUS_ADDRESS test
webpack:
	webpack --progress --watch
lint:
	node_modules/.bin/eslint project/frontend/js
	node_modules/.bin/stylint project/frontend/styles
