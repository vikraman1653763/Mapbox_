function toggleSlide() {
    document.addEventListener("DOMContentLoaded", function() {
        var sidebar = document.getElementById('sidebar');
        var imageContainer = document.getElementById('imageContainer');
        var docsContainer = document.getElementById('documentListContainer'); 
        var isVisibleSidebar = true;
        var isVisibleImageContainer = false;
        var isVisibleDocsContainer = false;
       
        // Toggle sidebar visibility
        document.getElementById('togglelayer').addEventListener('click', function() {
            isVisibleSidebar = !isVisibleSidebar;
            sidebar.classList.toggle('sidebar-visible');
            if (isVisibleImageContainer) {
                imageContainer.classList.toggle('image-visible');
                isVisibleImageContainer=false;
            }
            if(isVisibleDocsContainer){
                docsContainer.classList.toggle('docs-visible'); 
                isVisibleDocsContainer=false;
            };
           
});

     

        // Toggle image container visibility
        var toggleImageButton = document.getElementById('imageButton');
        toggleImageButton.addEventListener('click', function() {
            isVisibleImageContainer = !isVisibleImageContainer; 
            imageContainer.classList.toggle('image-visible'); 
            if (isVisibleSidebar) {
                sidebar.classList.toggle('sidebar-visible');
                isVisibleSidebar=false; 
            }
            if(isVisibleDocsContainer){
                docsContainer.classList.toggle('docs-visible');
                isVisibleDocsContainer=false;
            }
           
        });

        var toggleDocsButton = document.getElementById('docsButton');
        toggleDocsButton.addEventListener('click', function() {
            isVisibleDocsContainer = !isVisibleDocsContainer; 
            // this.querySelector('img').classList.toggle('clicked-image-border');
            docsContainer.classList.toggle('docs-visible'); 
            if (isVisibleSidebar) {
                sidebar.classList.toggle('sidebar-visible');
                isVisibleSidebar=false; 

            }
            if(isVisibleImageContainer){
                imageContainer.classList.toggle('image-visible'); 
                isVisibleImageContainer=false;
            }
           
        });
    });
}
