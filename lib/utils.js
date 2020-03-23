#!/usr/bin/env node

const git = require('simple-git'); 


const styles = {     
    'green': ['\x1B[32m', '\x1B[39m'], 
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'], 
    'redBG': ['\x1B[41m', '\x1B[49m'],  
}

exports.log = (key, obj) => {
    if (typeof obj === 'string') {
        console.log(styles[key][0] + '%s' + styles[key][1], obj)
    } 
     else {
        console.log(styles[key][0] + '%s' + styles[key][1], ...obj)
    }
}






exports.gitFn = {
    getRemotes(){
        return new Promise((resolve, reject) => {
            git().getRemotes(true,(e, r) => {
                if (e) {
                    reject();
                }
                resolve(r)
            });
        }) 
    },
    fetch() {
        return new Promise((resolve, reject) => {
            git().fetch((e, r) => {
                if (e) {
                    reject();
                }
                resolve(r)
            });
        }) 
    },
    getbranchmerged() {
        return new Promise((resolve, reject) => {
            git().branch(['--merged'], (err, res) => {
                if (err) reject();
                else resolve(res.all);
            })
        })
    },
    getCurrentBranch() {
        return new Promise((resolve, reject) => {
            git().status((err, res) => {
                if (err) reject();
                else resolve(res.current);
            });
        });
    },
    getCurrentBehind() {
        return new Promise((resolve, reject) => {
            git().status((err, res) => {
                if (err) reject();
                else resolve(res.behind);
            });
        })
    },
    getbranchInfo(branch) {
        return new Promise((resolve, reject) => {
            git().branch(['-vv'], (err, res) => {
                if (err) reject();
                else {
                    if (res.branches[branch]) {
                        resolve(res.branches[branch])
                    } else {
                        reject(res.branches[branch])
                    }
    
                }
            })
        })
    }    
} 