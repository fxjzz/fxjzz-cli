import { spawn } from 'child_process'

//process.platform 返回一个当前操作系统的字符串 'win32' 'darwin' 'linux'

//因为windows上命令文件通常是.cwd
//pnpm install path  
const commandSpawn = (command, opts, { cwd }) => {
  return new Promise((resolve) => {
    //跨平台
    const commandCmd = process.platform === 'win32' ? `${command}.cmd` : command

    const childProcess = spawn(commandCmd, opts, { cwd })
    childProcess.stdout.pipe(process.stdout)
    childProcess.stderr.pipe(process.stderr); //子流 连接到 父流，以便在控制台打印
    //防止子进程输出信息的缓存。如果子进程的输出信息太多，它可能会被缓存起来，直到子进程退出时才被发送到父进程。通过将子进程的输出流和错误流连接到父进程的输出流和错误流上，我们可以立即看到子进程输出的信息，而不必等到子进程退出时才看到。
    childProcess.on('close', () => {
      resolve();
    });
  })
}

export default commandSpawn