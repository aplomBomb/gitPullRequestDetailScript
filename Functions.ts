const credentials2 = require("./credentials");
const Octokit2 = require("@octokit/rest");

const octokit2 = new Octokit2({
  auth: credentials2.token
});

const org2 = credentials2.org;
const repo2 = credentials2.repo;

const methods = {
  checkForMergeability: async pullObject => {
    var i;
    for (i = 0; i < pullObject.length; i++) {
      var data = await octokit2.pulls.get({
        owner: org2,
        repo: repo2,
        pull_number: pullObject[i].pullNumber
      });

      let mergeable = data.data.mergeable;
      let additions = data.data.additions;
      let deletions = data.data.deletions;

      pullObject[i].mergeable = mergeable;
      pullObject[i].additions = additions;
      pullObject[i].deletions = deletions;

      if (i < pullObject.length) {
        continue;
      } else {
        break;
      }
    }
    console.log(pullObject); //Will display all open repo information in console
  }

  // test: () => {
  //   console.log("Test");
  // }
};

exports.data = methods;
