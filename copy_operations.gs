/* This code has few functions that I personally find usefull
 * copyAll() to copy all content in specified folder to destination folder
 *
 * If you ever created copy of multiple files and had to rename them manually
 * because it keeps 'Copy of' at the beginning of the name, there is this function that will do it for you
 * removeFromNameInBulk() looks for files in specified folder and removes 'Copy of' from name
 */

function copyAll() { 
  // function to copy all from source to destination
  
  var sourceFolder = "folder source";             // select source name of source folder you want the content to by coppied, I recommend using unique name, could not get it to work with ID
  var targetFolder = "1jwSplYQ9RabvbIxxxxxxxxxx";      // id of destination folder, because i like IDs

  var source = DriveApp.getFoldersByName(sourceFolder);
  var target = DriveApp.getFolderById(targetFolder);

  if (source.hasNext()) {
    copyFolder(source.next(), target);
  }
}

function copyFolder(source, target) {
  // function that takes source and target folder and performs the copying
  
  var folders = source.getFolders();
  var files   = source.getFiles();

  // copy all files
  while(files.hasNext()) {
    var file = files.next();
    file.makeCopy(file.getName(), target);
  }
  
  // if there are subfolders, call copyFolder on it and copy it to current folder
  while(folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    var targetFolder = target.createFolder(folderName);
    copyFolder(subFolder, targetFolder);
  }

}


function removeFromNameInBulk() {
  // function goes through folder files and if any of it begins with 'Copy of ', it removes it
  
  var folders = DriveApp.getFoldersByName('name of folder');
  var folder = folders.next();
  var files = folder.getFiles();
  
  while(files.hasNext()){
    var file = files.next()
    var fileName = file.getName();
    if (fileName.indexOf('Copy of ') > -1) {
        fileName= fileName.split('Copy of ')[1];
        file.setName(fileName);
    };
  };
}
