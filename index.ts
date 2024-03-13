import notifier from "node-notifier"
import dialog from "dialog-node"
import { spawn } from "child_process";


const run = function(cmd, cb?, callback?){
  console.log("args", cmd)
  var bin = cmd[0],
      args = cmd.splice(1),
      stdout = '', stderr = '';

  try {
    var child = spawn(bin, args);
  } catch (err) {
      console.log('spawn failed : ' + err.message);
  }

  var stdoutlines = 0;

  //this.debugprint(cmd,args,callback);

  child.stdout.on('data', function(data){
    stdout += data.toString();
    stdoutlines++;
  })

  child.stderr.on('data', function(data){
    stderr += data.toString();
  })

  child.on('error', function(error){
    console.log("dialog-node, error = ", error);
  });

  child.on('exit', function(code){
    cb && cb(code, stdout, stderr, callback);
  })
}

notifier.notify({
  title: "MinutAI",
  message: "Transcript summarised!",
  closeLabel: "Ignore",
  actions: "Save Transcript"
}, (err, response, metadata) => {
  console.log("err", err)
  console.log("response", response)
  console.log("metadata", metadata)
  if (response === "activate") {
    console.log("SHOW DIALOG")
    run([
      "osascript",
      "-e",
      'display dialog "What do you want to do?" with title "MinutAI" buttons {"Copy to Clipboard", "Send to Teams", "Email Attendees"} default button "Copy to Clipboard"'
    ])
  }
})