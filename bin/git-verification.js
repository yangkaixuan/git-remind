#!/usr/bin/env node


const {exec} = require('child_process')
const config = require('../package.json');
const {gitFn,log} = require('../lib/utils');


let mainBranch = 'master' //默认为 master 分支
const maxBuffer = 100 * 1024 * 1024;
const scriptName = process.argv[2];

if (config.mainBranch) mainBranch = config.mainBranch;


async  function main() {    
    let isOk = true; 
    const remotesList = await gitFn.getRemotes();
    if(!remotesList.length){
        log('red', '请先添加remotes');   
        isOk = false;
        return isOk;
    }
    const fetchContent = await gitFn.fetch(); 
    if (fetchContent.raw) {
        console.log(fetchContent.raw)
        log('green', ['√', '  1.fetch success!'])
    } else { 
        log('green', ['√', '  1.nothing to fetch'])
    }    
    const currentBranch = await gitFn.getCurrentBranch();    
    const mainBranchInfo = await gitFn.getbranchInfo(mainBranch);    
    const isBehind = mainBranchInfo.label.search(/behind(?= \d+\])/ig);	 
    const isAhead = mainBranchInfo.label.search(/ahead(?= \d+\])/ig);   
    if (isBehind === -1 && isAhead === -1) {
        log('green', ['√', `  2.主干分支:${mainBranch}分支 为最新提交`]);
    }
    if (isBehind !== -1) {
        isOk = false;
        log('red', [`×   2.${mainBranch}主干分支需要更新`]);
    } 
    if (isAhead !== -1) {
        log('red', [`×   2.注意本地 ${mainBranch} 主干分支没有提交`]);
    }
    
    if (currentBranch !== mainBranch) {
        const mergedList = await gitFn.getbranchmerged();
        const ismerged = mergedList.includes(mainBranch);
        if (ismerged) {
            log('green', ['√', `  3.当前分支${currentBranch}已经合并了主干分支${mainBranch}`])
        } else {
            isOk = false;
            log('red', [`×   3.发现当前分支${currentBranch}没有合并主干${mainBranch}分支，是否合并？`]);         
        }
        const Behind = await gitFn.getCurrentBehind();
        if (Behind === 0) {
            log('green', ['√', `  4.当前分支${currentBranch}目前没有更新`])
        } else {
            isOk = false;
            log('red', [`×   4.当前分支${currentBranch}目前没有更新`])
        }
    }
    return isOk;
    
}
async function init() { 
    let isOk = await main();
    if (isOk) log('green', ['√', '  验证通过 !!!']);
    if (isOk && scriptName) {  
        console.log('验证通过 开始编译');       
        const childProces = exec(`npm run ${scriptName}`, {maxBuffer});
        childProces.stderr.pipe(process.stderr);
        childProces.stdout.pipe(process.stdout);
    } else if (!isOk) {
        log('red', '进程中断 请先上面解决问题');   
    }
}
init() 