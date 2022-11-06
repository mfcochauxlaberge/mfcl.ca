window.onload = () => {
  let contentElem = document.getElementById("content");

  // Home page
  let linkHome = document.getElementById("link_home");
  linkHome.addEventListener("click", () => {
    goTo(contentElem, "home.html");
  });

  // Blog page
  let linkBlog = document.getElementById("link_blog");
  linkBlog.addEventListener("click", () => {
    goTo(contentElem, "blog.html");
  });
};

const goTo = (parent: HTMLElement, path: string) => {
  let content = "could not load";

  fetch(path).then(async (response) => {
    content = await response.text();
    parent.innerHTML = content;
  });
};
