cd $(git rev-parse --show-toplevel) \
&& npm install \
&& mkdir -p "move" \
&& cp -fR dist/* move \
&& ( (git checkout master \
&& cp -fR move/* dist \
&& git add . \
&& git commit -m "Release from develop" \
&& git push \
&& git checkout develop) || git checkout develop \
&)