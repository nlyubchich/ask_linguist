run:
	vagga run

test: lint
	xhost +
	vagga -eDISPLAY -eDBUS_SESSION_BUS_ADDRESS test
	xhost -

webpack:
	node_modules/.bin/webpack --progress --watch

lint:
	flake8 project
	node_modules/.bin/eslint project/frontend/js/**/*
	node_modules/.bin/stylint project/frontend/styles
