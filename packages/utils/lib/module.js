import path from 'path'

export default async function (request, targetDir) {
  const res = await import(
    `file:///${path.resolve(
      targetDir, `./node_modules/@fxjzz-cli/${request.slice(11)}/lib/index.js`
    )}`
  )
  return res
}