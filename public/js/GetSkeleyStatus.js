// RESEARCH THIS MAKE WORK PLS

headers= {Authorization: "Bot "+ "OTc5ODcyMDE4MjczMDIyMDQz.GZPl89.n5C8uioXOgcls-dFPOp5SzE40ZSicfUzQ4EZU4"}
fetch("https://discord.com/api/v10/users/600048981753593858", headers= headers).then((response) =>
    response.json().then((value) => console.log(value))
)