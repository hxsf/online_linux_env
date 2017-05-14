const pty = require('pty.js')
const io = require('socket.io')(10000)
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

io.of('/pty').on('connection', function (socket) {
    var term = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 20,
        cwd: '/workspace',
        env: process.env,
    })
    term.on('data', (data) => {
        socket.emit('pty', data)
    })
    socket.on('resize', ({cols, rows}) => {
        term.resize(cols, rows)
    })
    socket.on('tty', (data) => {
        term.write(data)
    })
    socket.on('disconnect', (msg) => {
        term.destroy()
    })
})
io.of('/fs').on('connection', function (socket) {
    socket.on('readdir', (basedir, cb) => {
        fs.readdir(basedir, (err, list) => {
            if (err) return cb(err, []);
            let files = [];
            let folders = [];
            for (let name of list) {
                let fullpath = path.join(basedir, name);
                let stats = fs.statSync(fullpath);
                if (stats.isFile()) {
                    files.push({
                        name,
                        basedir,
                        fullpath,
                        type: 'file',
                    });
                } else if (stats.isDirectory()) {
                    folders.push({
                        name,
                        basedir,
                        fullpath,
                        type: 'folder',
                    });
                }
            }
            cb(null, {files, folders})
        });
    })
    socket.on('readFile', (fullpath, cb) => {
        fs.readFile(fullpath, 'utf8', cb)
    })
    socket.on('writeFile', (fullpath, str, cb) => {
        fs.writeFile(fullpath, str, 'utf8', cb)
    })
    socket.on('remove', (fullpath, cb) => {
        rimraf(fullpath, cb)
    })
    socket.on('createDir', (fullpath, cb) => {
        mkdirp(fullpath, cb)
    })
    socket.on('createFile', (fullpath, cb) => {
        const dirname = path.dirname(fullpath)
        if (!fs.existsSync(dirname)) mkdirp.sync(dirname)
        fs.writeFile(fullpath, '', cb)
    })
    socket.on('move', (oldpath, newpath, cb) => {
        const dirname = path.dirname(newpath)
        if (!fs.existsSync(dirname)) mkdirp.sync(dirname)
        fs.rename(oldpath, newpath, cb)
    })
})
