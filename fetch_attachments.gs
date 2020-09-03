/*
 * This script is used to fetch all attachments of new emails
 * from inbox of user running it. Saving it to designated folder
 * into subfolders with name of the subject of the email.
 * Read messages then yeets to Archive.
 */


// Runtime //
function main() {
  // get inbox threads and check if there is any new
  // if yes, go through them and download attachments if there are any
 
  Logger.log("Attachment fetcher starting...");
  var inboxContent = GmailApp.getInboxThreads();
  
  if(inboxContent.length == 0) {
    //if no items detected, return
    
    Logger.log("No new messages detected.");
    return;
    
  } else if(inboxContent.length > 0) {
    //if there are items, go fetch attachments
    //even in case of no attachments, archive those items
    Logger.log(inboxContent.length + " new items in the inbox.\nFetching...");
    
    var folderToSaveId = "1v2kqn2uNPk5D8aug__qSHFv9EDbHO49k";
    // this is Id of folder to save attachments to
    
    getAttachments(inboxContent, folderToSaveId);
    moveToArchive(inboxContent);
  }
}


// Functions //
function getAttachments(payload, folderId) {  
  // checks all threads passed as payload for attachments
  // saves all attachments in file with date and subject of thread
  
  for (var i = 0; i < payload.length; i++) {
    
    var attachmentCount = 0;
    var attachmentLog = "";
    var thread = payload[i];
    var messages = GmailApp.getMessagesForThread(thread);
    //get all messages for current thread
    
    for (var j = 0; j < messages.length; j++) {
      
      var message = messages[j];      
      var attachments = message.getAttachments();
      //get all attachments for current message
      
      if (attachments.length > 0) {
        //if there are any attachments, continue this branch
       
        var firstDate = messages[0].getDate();
        var messageDate = "[" + firstDate.getDay() + "." + (firstDate.getMonth() + 1) + "." + firstDate.getFullYear() + "]";
        // string for name of new folder, prefix with date of thread
        
        attachmentCount += attachments.length;
        // increase count of attachments for logging purposes
        
        var parentFolder = DriveApp.getFolderById(folderId);
        var newFolder = parentFolder.createFolder(messageDate + " " + thread.getFirstMessageSubject());
        //create folder with the messageDate and subject of first message
        
        for(var n = 0; n < attachments.length; n++) {
          //take each attachment and place it in the newFolder
          
          var attachment = attachments[n];
          var file = newFolder.createFile(attachment);
          attachmentLog += "  + Saved: " + file.getName() + "\n";
          //log the operation of saving the file
        }
      }      
    }
    Logger.log("+ " + attachmentCount + " of " + payload[i].getFirstMessageSubject());
    if (attachmentLog) {Logger.log(attachmentLog)};
    //log how many attachments did the thread had, eventually list them if they were saved
  }
}

function moveToArchive(payload) {
  GmailApp.moveThreadsToArchive(payload);
  Logger.log("Archived " + payload.length + " items.");
  //just to have this separated and logged
}
