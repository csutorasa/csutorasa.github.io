@del /Q *.html
@del /Q *.js
@del /Q *.css
@del /Q *.eot
@del /Q *.svg
@del /Q *.woff
@del /Q *.woff2
@del /Q *.ttf
@del /Q *.ico
@del /Q *.txt

@xcopy .\dist\csutorasa\* . >NUL
