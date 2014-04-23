# Pronode
Manage easily an Node.JS infrastructure on a unix system.
_________________
### Installation
Clone the repository, install with npm and create a .pronode folder in your home.
```
git clone https://github.com/Seris/Pronode.git pronode
cd pronode && npm install
npm link
cd && mkdir .pronode && cd .pronode && touch config.json
```
Pronode is a daemon just like Apache and must be started as root.
In your .pronode folder, create a config.json file.
+ ~httpPort: Define the port of the http server (default = process.env.NODE_PORT or 80)
_________________
### Command List
##### pronode server start
Start the pronode server

##### pronode [start/restart/stop] &lt;app&gt;
Start/Restart/Stop an configured Node.JS application
_________________
### How to configure an application
Create a folder which the name is your application name in ~/.pronode and create a config.json inside.
(*key = required / ~key = optional)

+ *entry_point: Path to the main file of your application
+ ~chroot : Path for chroot
+ ~user : Start the application with this user (default => 'nobody')
__/!\\ As nobody, the application could not write at all. /!\\__
+ ~group : Start the application with this group (default => 'nogroup')
