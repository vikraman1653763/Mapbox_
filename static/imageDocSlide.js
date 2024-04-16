function toggleImageSlide(projectId) {
    var projectId = projectId;

    $(document).ready(function() {
        // Assign the project ID from Flask to JavaScript variable

        // Make an AJAX request to fetch images from the database
        $.ajax({
            url: '/get-images/' + projectId, // Use projectId variable in the URL
            method: 'GET',
            success: function(response) {
                // Check if the response contains any images
                if (response && response.images) {
                    // Prepend the heading "Images" inside the image container
                    $('#imageContainer').html('<h2 class="imageTitle">Images</h2>');

                    // Iterate through the images and append them to the image container
                    response.images.forEach(function(imagePath) {
                        // Construct the correct URL path for accessing the images
                        var imageUrl = imagePath;
                        $('#imageContainer').append('<img class="renderImages" src="' + imageUrl + '" alt="Image">');
                    });

                    // Add click event listener to the rendered images
                    $('.renderImages').click(function() {
                        var imagePath = $(this).attr('src');
                        openPopup(imagePath);
                    });
                } else {
                    // If no images found, display a message
                    $('#imageContainer').html('<h2>Images</h2>No images found.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching images:', error);
                $('#imageContainer').html('<h2>Images</h2>Error fetching images. Please try again later.');
            }
        });
    });
}


// Function to open popup and display the clicked image
// Function to open the popup
function openPopup(imagePath) {
    $('#popupImage').attr('src', imagePath); // Set the src attribute of popup image
    $('#popupImageContainer').css('display', 'flex'); // Display the popup container with flex
}

// Function to close the popup
function closePopup() {
    $('#popupImageContainer').css('display', 'none'); // Hide the popup container by setting display to none
}

function toggleDocSlide(projectId) {
    var projectId = projectId;

    $(document).ready(function() {
        // Make an AJAX request to fetch documents from the database
        $.ajax({
            url: '/get-docs/' + projectId, // Use projectId variable in the URL
            method: 'GET',
            success: function(response) {
                // Check if the response contains any documents
                if (response && response.docs) {
                    
                    // Create a container to hold the list of document names and download links
                    var docsListContainer = $('<div>');
                    
                    // Iterate through the documents and append their names with download links
                    response.docs.forEach(function(doc) {
                        var docName = doc.name;
                        var docId = doc.id;
                        var downloadUrl = '/download/' + docId; // Modify the URL accordingly
                        var downloadImage = $('<img>')
                        .attr('src', '/static/resources/images/download.svg') // Assuming the image is located at this path
                        .attr('alt', 'Download');
                        // Create a link for downloading the document
                        var downloadLink = $('<a>')
                        .attr('href', downloadUrl)
                        .append(downloadImage); // Append the image to the link
                        
                        var row = $('<div>').addClass('doc-row');
                        
                        // Append document name and download link to the row container
                        row.append($('<span>').addClass('doc-name').text(docName), downloadLink);
                        
                        // Append the row container to the document list container
                        docsListContainer.append(row);
                        
                    });
                    var documentContent = $('<div>')
                        .append('<h2 class="imageTitle">Documents</h2>')
                        .append(docsListContainer);
                    // Append the container with the list of document names and download links to the document container
                    $('#documentListContainer').html(documentContent);
                } else {
                    // If no documents found, display a message
                    $('#documentListContainer').html('<p>No documents found </p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching documents:', error);
                $('#documentListContainer').html('<p>Error fetching documents. Please try again later.</p>');
            }
        });
    });
}

