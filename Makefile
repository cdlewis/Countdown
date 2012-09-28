#
# css/js minification/compression makefile
#

#
#   JS_TARGETS -- js files to minify/gzip
#   CSS_TARGETS -- css files to minify/gzip
#   CLEANUP -- additional files to delete during "make clean"
# 

compiled.css: css/main.css
	cat $^ >$@

compiled.js: js/jquery.js js/leanModal.js js/stdlib.js js/main.js
	java -jar ~/random_progs/googleclosure/compiler.jar $(addprefix --js=,$^) >$@

JS_TARGETS = compiled.js
CSS_TARGETS = compiled.css
CLEANUP = compiled.css compiled.js

#######################################################
# you shouldn't need to edit anything below this line #
#######################################################

.DEFAULT_GOAL := all

all: js css

YUI = java -jar ~/random_progs/yuicompressor/build/yuicompressor-2.4.8pre.jar
YUI_FLAGS = --type css

CLOSURE = java -jar ~/random_progs/googleclosure/compiler.jar
CLOSURE_FLAGS = 

.PHONY: css js

%.gz: %
	gzip -9 <$< >$@

# css
# ---

CSS_MINIFIED = $(CSS_TARGETS:.css=.min.css)
CSS_GZIP = $(CSS_TARGETS:.css=.css.gz)
CSS_MIN_GZIP = $(CSS_TARGETS:.css=.min.css.gz)

css: $(CSS_TARGETS) $(CSS_MINIFIED) $(CSS_GZIP) $(CSS_MIN_GZIP)

%.min.css: %.css
	 $(YUI) $(YUI_FLAGS) <$< | sed 's/ and(/ and (/g' >$@

# javascript
# ----------

JS_MINIFIED = $(JS_TARGETS:.js=.min.js)
JS_GZIP = $(JS_TARGETS:.js=.js.gz)
JS_MIN_GZIP = $(JS_TARGETS:.js=.min.js.gz)

js: $(JS_TARGETS) $(JS_MINIFIED) $(JS_GZIP) $(JS_MIN_GZIP)

%.min.js: %.js
	$(CLOSURE) $(CLOSURE_FLAGS) --js=$< >$@

clean:
	rm -f $(CSS_GZIP) $(CSS_MIN_GZIP) $(JS_GZIP) $(JS_MIN_GZIP) $(CLEANUP)