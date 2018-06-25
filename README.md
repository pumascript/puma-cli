# puma-cli
CLI tool for PumaScript usage and integration 



## Getting started with puma-cli 

> git clone https://github.com/pumascript/puma-cli.git.  
> npm install

To run puma-cli without prefixing the node command, run the following command within the location of the puma-cli.js file:  
> npm link


## Command list:

* Run

It allows to execute a file with puma extension passing as parameter the address of the file. It is recommended to use the extension puma.js  
puma-cli run file-address

Options:  
-h, --help output usage information

Example: puma-cli run name.puma.js

* Compile

It allows to execute and compile a file with .puma extension to a JavaScript file.  
puma-cli compile file-address

Options:  
-n, --name file-name name javascript program   
-h, --help  output usage information

Example: puma-cli compile name.puma.js -n filename

* Test 

It allows testing in PumaScript a set of CDNs that are entered by means of a .json extension file, recording the errors found.  
puma-cli test file-address.json

Options:  
-o, --outdir fileError-address   location where you want to save the error file.  
-n, --outname file-name   name of the file where you want to record the errors.  
-h, --help output usage information  

Example: puma-cli test ./dependency.json -o C:\Users\Usuario\Desktop -n errors



