const functions = require("./Functions.ts");
const credentials = require("./credentials");
const Octokit = require("@octokit/rest");

const octokit = new Octokit({
  auth: credentials.token
});

const org = credentials.org;
const repo = credentials.repo;

const getFiles = async numberUser => {
  var i;
  for (i = 0; i < numberUser.length; i++) {
    var data = await octokit.pulls.listFiles({
      owner: org,
      repo: repo,
      pull_number: numberUser[i].pullNumber
    });
    let fileAcc = [];

    data.data.map(function(obj) {
      fileAcc.push(obj.filename);

      numberUser[i].changedFiles = fileAcc;
    });

    if (i < numberUser.length) {
      continue;
    } else {
      break;
    }
  }

  functions.data.checkForMergeability(numberUser);
};

octokit.pulls
  .list({
    owner: org,
    repo: repo
  })
  .then(({ data }) => {
    let numberUser = data.map(function(obj) {
      return {
        title: obj.title,
        pullNumber: obj.number,
        user: obj.user.login,
        url: obj.url,
        diffUrl: obj.diff_url,
        changedFiles: []
      };
    });

    getFiles(numberUser);
  });
