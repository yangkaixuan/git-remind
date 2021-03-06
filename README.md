# git-remind
### 背景
在团队开发中可能遇到如下场景  
- 场景一：A需求从主干分支创建A分支进行开发，在开发过程中，可能有几个其他需求上线合并到主干分支，这时候A应该立即合并主干分支并解决冲突。但是可能存在等到上线才想到合并，甚至会忘记合并。  
隐患1：如果到上线的时候才想起合并。上线的内容和测试的内容可能不同，存在风险。如果存在冲突，还需进一步测试。     
隐患2：有可能在上线的时候忘记合并主干分支，那么在开发周期内上线的内容就没有了。

- 场景二：在多人开发同一个需求的时候使用同一个C分支，A同学修改了一个bug，提交C分支，编译上传测试版本，B同学修改了一个bug上传后可能忘记并合并远程C分支，这时A同学改完的bug的代码没有合并到测试版本。

在开发的过程中这些问题我们可能采用群里通知手动拉代码合并的方式去解决，但是人总会犯错，总有忘记的时候。这时把任务交给脚本去处理可能是更好的选择  

### 说明
脚本基于node、git 可以放在常用的命令之后，例如dev、build在编译之前进行检查，只有全部通过检查才能继续后面的操作  
### 检查流程
1.跟远程分支数据同步，但不合并   
2.检查主干分支是否需要更新   
3.检查当前主干分支是否有未上传提交内容  
4.检查当前分支是否合并主干  
5.检查当前分支是否需要更新   
6.检查当前分支是否需要有未上传提交内容  

### 安装
```
npm i -D git-remind
```
### 使用
```
git-remind [--bin <command>] [--main-branch <mainbranch>] [--branch-only {mainBranch | currentBranch}]
```
git-remind 也可以简写成gr 还有其他参数简写例如
```
gr [-b <command>] [-m<mainbranch>] [-r {mainBranch | currentBranch}]

```



|参数|说明|
|:----:|:----|
|--bin |在检查脚本通过之后运行的命令，比如 --b build | 
|--main-branch|设置主干分支 例如 --m v2，默认为master，还可以在package.json中配置|
|--branch-only|只检查主干分支或者当前分支|

例如

```
"scripts": {
   "rbuild": "git-remind -b build",
   "build": "..."
},

```
在package.json中配置主干分支
```
mainBranch:XX
```

