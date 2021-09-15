

class PhotoGallery {
  constructor() {
    this.API_KEY = "563492ad6f91700001000001ff5d1d6d745f4093981f9048fd736d71"
    this.galleryDIv = document.querySelector(".gallery");
    this.searchForm = document.querySelector(".header form");
    this.loadMore = document.querySelector(".load-more");
    this.logo = document.querySelector(".logo");
    this.pageIndex = 1;
    this.eventHandle();
  }


    
  eventHandle() {
    document.addEventListener("DOMContentLoaded", () => {
      this.getImg(1);
    });
    console.log(this.API_KEY)
    this.searchForm.addEventListener("submit", (e) => {
      this.pageIndex = 1;
      this.getSearchedImages(e);
    });
    this.loadMore.addEventListener("click", (e) => {
      this.loadMoreImages(e);
    });
    this.logo.addEventListener("click", () => {
      this.pageIndex = 1;
      this.galleryDIv.innerHTML = "";
      this.getImg(this.pageIndex);
    });
  }

  async getImg(index) {
    this.loadMore.setAttribute("data-img", "curated");

    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
    console.log(data); // for testing
  }

  async fetchImages(baseURL) {
    const response = await fetch(baseURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.API_KEY,
      },
    });

    const data = await response.json();
    return data;
  }

  GenerateHTML(photos) {
    photos.forEach((photo) => {
      const item = document.createElement("div"); //creates a div element
      item.classList.add("item"); //adds the css class which is located in style.css
      item.innerHTML = `
                         <a href="${photo.src.original}" target="_blank">
                         <img  src="${photo.src.medium}">
                         </a>
                         <h3>${photo.photographer}</h3>
                  `;
      this.galleryDIv.appendChild(item); // adds item to gallery div
    });
  }
  async getSearchedImages(e) {
    this.loadMore.setAttribute("data-img", "search");
    e.preventDefault(); //prevent reloading the website which is the default behaviour of the form.
    this.galleryDIv.innerHTML = "";
    const searchValue = e.target.querySelector("input").value;
    this.searchValueGlobal = searchValue;
    const baseURL =
      await `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
    e.target.reset();
  }

  async getMoreSearchedImages(index) {
    const baseURL =
      await `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
  }
  loadMoreImages(e) {
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute("data-img");
    if (loadMoreData === "curated") {
      //load page two for curated
      this.getImg(index);
    } else {
      //load page 2 for search
      this.getMoreSearchedImages(index);
    }
  }
}

const gallery = new PhotoGallery();
