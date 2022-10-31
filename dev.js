document.dispatchEvent(
  new CustomEvent("RW759_connectExtension", {
    detail: {AccessToken: AccessToken,
             UserName: UserName,
             UserID:UserID,
              }
  })
);

