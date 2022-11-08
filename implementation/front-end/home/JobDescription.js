function getTimeDescriptionFromSeconds(seconds) {
    let minute = 60;
    let hour = minute * 60;

    if (seconds < minute) {
        return `Just now`;
    }

    if (seconds > minute && seconds < hour) {
        return `${Math.floor(seconds / minute)} minutes ago`;
    }

    return `${Math.floor(seconds / hour)} hours ago`;
}

async function getLikeList(jobDescriptionId) {
    try {
        console.log("hellooooo", jobDescriptionId);
        // Giang's job: change this to POST method and send the id of the job description, then GET the list of likes
        let likeData = await fetch("../data/like_list.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: "Bearer " + localStorage.getItem("token"),
            },
        });

        likeData = await likeData.json();
        createLikeListContainer(likeData);
    } catch (error) {
        console.log(error);
    }
}

async function getCommentList(jobDescriptionId) {
    try {
        console.log(jobDescriptionId);
        // Giang's job: change this to POST method and send the id of the job description, then GET the list of comments
        let commentData = await fetch("../data/cmt_list.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: "Bearer " + localStorage.getItem("token"),
            },
        });

        commentData = await commentData.json();
        createCommentListContainer(commentData, jobDescriptionId);
    } catch (error) {
        console.log(error);
    }
}

function createLikeListContainer(likeList) {
    let likeListHTML = document.createElement("div");
    for (let i = 0; i < likeList.length; i++) {
        let likeItem = document.createElement("div");
        likeItem.setAttribute("class", "like-item");
        likeItem.innerHTML = `
            <img src="data:image/png;base64,${likeList[i].ava}" alt="John" style="width:10%">
            &emsp; ${likeList[i].name}
        `;
        likeListHTML.appendChild(likeItem);
    }

    let likeModal = document.getElementById("likeModalBody");
    likeModal.removeChild(likeModal.childNodes[0]);
    likeModal.appendChild(likeListHTML);
}

function createCommentListContainer(commentList, jobDescriptionId) {
    let commentListHTML = document.createElement("div");
    for (let i = 0; i < commentList.length; i++) {
        let commentItem = document.createElement("div");
        commentItem.setAttribute("class", "comment-item");
        commentItem.setAttribute("style", "padding: 10px");
        commentItem.innerHTML = `
            <img src="data:image/png;base64,${commentList[i].ava}" alt="John" style="width:10%">
            &emsp; ${commentList[i].name}
            <p>${commentList[i].comment}</p>
        `;
        commentListHTML.appendChild(commentItem);
    }

    let cmtContainer = document.getElementById(
        `cmt_${jobDescriptionId}_container`
    );
    cmtContainer.innerHTML = "";
    cmtContainer.appendChild(commentListHTML);

    let cmtInput = document.createElement("div");
    cmtInput.innerHTML = `
        <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea" style="height: 100px"></textarea>
            <label for="floatingTextarea">Comment</label>
        </div> 
    `;
    cmtContainer.appendChild(cmtInput);
}

function createJdContainer(jobDescriptionData) {
    let jdHTML = document.createElement("div");

    jdHTML.innerHTML = `
    <div class="card card gedf-card">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="data:image/png;base64,${
                            jobDescriptionData.employerAvatar
                        }" alt="">
                    </div>
                    <div class="ml-2">
                        <div class="h5 m-0"> ${
                            jobDescriptionData.employerName
                        } </div>
                        <div class="h7 text-muted"> ${
                            jobDescriptionData.employerOrganization
                        } </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i> ${getTimeDescriptionFromSeconds(
                jobDescriptionData.secondsBefore
            )}</div>
            <h5 class="card-title">${jobDescriptionData.title}</h5>

            <p class="card-text">
                ${jobDescriptionData.content}
            </p>
        </div>

        <div class="card-footer">
            <button type="button" class="btn btn-light btn-sm" id="like_${
                jobDescriptionData.id
            }" data-bs-toggle="modal" data-bs-target="#likeListModal">
                ${jobDescriptionData.likes}
            </button>
            <button type="button" class="btn btn-light">
                <a class="card-link">
                    <i class="fa fa-gittip"></i> Like
                </a>
            </button>
            
            <button type="button" class="btn btn-light" id="cmt_${
                jobDescriptionData.id
            }">
                ${jobDescriptionData.comments}
                <a class="card-link">
                    <i class="fa fa-comment"></i> Comment
                </a>
            </button>

            <button type="button" class="btn btn-light">
                <a class="card-link">
                    <i class="fa fa-clipboard"></i> Copy link
                </a>
            </button>
        </div>
        <div id="cmt_${jobDescriptionData.id}_container"></div>
    </div>
    `;

    document.getElementById("jdContainer").appendChild(jdHTML);

    document.getElementById(`like_${jobDescriptionData.id}`).onclick = () => {
        getLikeList(jobDescriptionData.id);
    };

    document.getElementById(`cmt_${jobDescriptionData.id}`).onclick = () => {
        getCommentList(jobDescriptionData.id);
    };
}

$(document).ready(async function () {
    try {
        let jobDescriptionsData = await fetch("../data/job_descriptions.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: "Bearer " + localStorage.getItem("token"),
            },
        });

        jobDescriptionsData = await jobDescriptionsData.json();

        for (let i = 0; i < jobDescriptionsData.length; i++) {
            createJdContainer(jobDescriptionsData[i]);
        }
    } catch (error) {
        console.log(error);
    }
});
