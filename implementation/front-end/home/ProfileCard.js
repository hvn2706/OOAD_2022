function createProfileCard(myProfile) {
    let profileCard = document.createElement("div");
    profileCard.setAttribute("class", "card-profile");

    profileCard.innerHTML = `
        <div class="card-profile">
            <img src="data:image/png;base64,${myProfile.avatar}" alt="John" style="width:100%">
            <h1>${myProfile.name}</h1>
            <p class="title-profile">${myProfile.intro}</p>
            <p><button class="button-profile">View your profile</button></p>
        </div>`;

    return profileCard;
}

$(document).ready(async function () {
    try {
        let profileData = await fetch("../data/profile.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authentication: "Bearer " + localStorage.getItem("token"),
            },
        });

        profileData = await profileData.json();
        let profileCard = createProfileCard(profileData);
        document.getElementById("profileContainer").appendChild(profileCard);
    } catch (error) {
        console.log(error);
    }
});
