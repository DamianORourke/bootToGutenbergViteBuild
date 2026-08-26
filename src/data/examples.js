/**
 * Bootstrap to Gutenberg Converter - Example Templates
 *
 * This module contains Bootstrap HTML example templates used for testing the converter.
 * These examples are extracted from bootToGutenberg.html (lines 2490-3213) and demonstrate
 * various Bootstrap 5.3 components and patterns.
 *
 * @module examples
 * @example
 * import { examples, exampleNames, exampleCategories } from './data/examples.js'
 *
 * // Get HTML for a specific example
 * const jumbotronHtml = examples.jumbotron
 *
 * // Get the display name for the dropdown
 * const jumbotronLabel = exampleNames.jumbotron  // 'Jumbotron'
 *
 * // Iterate by category
 * for (const [category, keys] of Object.entries(exampleCategories)) {
 *   console.log(category, keys.map(k => exampleNames[k]))
 * }
 */

/**
 * Example HTML templates
 * Keys match the loadExample() function calls in the original bootToGutenberg.html
 * @type {Object.<string, string>}
 */
export const examples = {
  // ==========================================================================
  // LAYOUT PATTERNS
  // ==========================================================================

  jumbotron: `<div class="container my-5">
    <div class="p-5 text-center bg-body-tertiary rounded-3">
        <svg class="bi mt-4 mb-3" style="color: var(--bs-indigo);" width="100" height="100" aria-hidden="true">
            <use xlink:href="#bootstrap"></use>
        </svg>
        <h1 class="text-body-emphasis">Jumbotron with icon</h1>
        <p class="col-lg-8 mx-auto fs-5 text-muted">
            This is a custom jumbotron featuring an SVG image at the top, some longer text that wraps early thanks to a
            responsive <code>.col-*</code> class, and a customized call to action.
        </p>
        <div class="d-inline-flex gap-2 mb-5">
            <button class="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill" type="button">
                Call to action
                <svg class="bi ms-2" width="24" height="24" aria-hidden="true">
                    <use xlink:href="#arrow-right"></use>
                </svg>
            </button>
            <button class="btn btn-outline-secondary btn-lg px-4 rounded-pill" type="button">
                Secondary link
            </button>
        </div>
    </div>
</div>`,

  features: `<div class="container py-5">
<div class="row g-4">
  <div class="col-md-4 text-center">
    <div class="p-4">
      <i class="bi bi-lightning-charge fs-1 text-primary mb-3"></i>
      <h3 class="h5 mb-3">Feature One</h3>
      <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  </div>
  <div class="col-md-4 text-center">
    <div class="p-4">
      <i class="bi bi-shield-check fs-1 text-primary mb-3"></i>
      <h3 class="h5 mb-3">Feature Two</h3>
      <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  </div>
  <div class="col-md-4 text-center">
    <div class="p-4">
      <i class="bi bi-graph-up fs-1 text-primary mb-3"></i>
      <h3 class="h5 mb-3">Feature Three</h3>
      <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  </div>
</div>
</div>`,

  cta: `<div class="bg-primary py-5">
<div class="container">
  <div class="row">
    <div class="col-12 text-center">
      <h2 class="text-white mb-4">Ready to Get Started?</h2>
      <p class="text-white-50 mb-4">Join thousands of satisfied customers today.</p>
      <a href="#" class="btn btn-light btn-lg">Sign Up Now</a>
    </div>
  </div>
</div>
</div>`,

  pricing: `<div class="container py-5">
<div class="row g-4">
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-header text-center py-3">
        <h4 class="my-0 fw-normal">Free</h4>
      </div>
      <div class="card-body">
        <h1 class="card-title text-center">$0<small class="text-muted fw-light">/mo</small></h1>
        <ul class="list-unstyled mt-3 mb-4">
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>10 users included</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>2 GB of storage</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Email support</li>
        </ul>
        <button type="button" class="w-100 btn btn-lg btn-outline-primary">Sign up for free</button>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100 border-primary">
      <div class="card-header text-center py-3 bg-primary text-white">
        <h4 class="my-0 fw-normal">Pro</h4>
      </div>
      <div class="card-body">
        <h1 class="card-title text-center">$15<small class="text-muted fw-light">/mo</small></h1>
        <ul class="list-unstyled mt-3 mb-4">
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>20 users included</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>10 GB of storage</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Priority email support</li>
        </ul>
        <button type="button" class="w-100 btn btn-lg btn-primary">Get started</button>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-header text-center py-3">
        <h4 class="my-0 fw-normal">Enterprise</h4>
      </div>
      <div class="card-body">
        <h1 class="card-title text-center">$29<small class="text-muted fw-light">/mo</small></h1>
        <ul class="list-unstyled mt-3 mb-4">
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>50 users included</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>50 GB of storage</li>
          <li class="mb-2"><i class="bi bi-check text-success me-2"></i>Phone & email support</li>
        </ul>
        <button type="button" class="w-100 btn btn-lg btn-outline-primary">Contact us</button>
      </div>
    </div>
  </div>
</div>
</div>`,

  // ==========================================================================
  // CONTENT
  // ==========================================================================

  card: `<div class="width-25-desktop card">
<img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="card-img-top" alt="...">
<div class="card-body">
  <h5 class="card-title">Card title</h5>
  <p class="card-text">This is a wider card with supporting text below.</p>
</div>
<div class="card-footer">
  <small class="text-muted">Last updated 3 mins ago</small>
</div>
</div>`,

  cardGroup: `<div class="card-group">
<div class="card">
  <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below.</p>
  </div>
  <div class="card-footer">
    <small class="text-muted">Last updated 3 mins ago</small>
  </div>
</div>
<div class="card">
  <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This card has supporting text below as a natural lead-in.</p>
  </div>
  <div class="card-footer">
    <small class="text-muted">Last updated 3 mins ago</small>
  </div>
</div>
<div class="card">
  <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below.</p>
  </div>
  <div class="card-footer">
    <small class="text-muted">Last updated 3 mins ago</small>
  </div>
</div>
</div>`,

  listGroup: `<ul class="list-group">
<li class="list-group-item d-flex justify-content-between align-items-center">
  A list item
  <span class="badge bg-primary rounded-pill">14</span>
</li>
<li class="list-group-item d-flex justify-content-between align-items-center">
  A second list item
  <span class="badge bg-primary rounded-pill">2</span>
</li>
<li class="list-group-item d-flex justify-content-between align-items-center">
  A third list item
  <span class="badge bg-primary rounded-pill">1</span>
</li>
</ul>`,

  table: `<table class="table table-striped table-hover">
<thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">First</th>
    <th scope="col">Last</th>
    <th scope="col">Handle</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">1</th>
    <td>Mark</td>
    <td>Otto</td>
    <td>@mdo</td>
  </tr>
  <tr>
    <th scope="row">2</th>
    <td>Jacob</td>
    <td>Thornton</td>
    <td>@fat</td>
  </tr>
  <tr>
    <th scope="row">3</th>
    <td colspan="2">Larry the Bird</td>
    <td>@twitter</td>
  </tr>
</tbody>
</table>`,

  figures: `<figure class="figure">
<img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="figure-img img-fluid rounded" alt="...">
<figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>`,

  // ==========================================================================
  // COMPONENTS
  // ==========================================================================

  accordion: `<div class="accordion" id="accordionExample">
<div class="accordion-item">
  <h2 class="accordion-header">
    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      Accordion Item #1
    </button>
  </h2>
  <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <strong>This is the first item's accordion body.</strong> It is shown by default.
    </div>
  </div>
</div>
<div class="accordion-item">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      Accordion Item #2
    </button>
  </h2>
  <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <strong>This is the second item's accordion body.</strong> It is hidden by default.
    </div>
  </div>
</div>
<div class="accordion-item">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      Accordion Item #3
    </button>
  </h2>
  <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
    <div class="accordion-body">
      <strong>This is the third item's accordion body.</strong> It is hidden by default.
    </div>
  </div>
</div>
</div>`,

  alerts: `<div class="alert alert-primary" role="alert">
A simple primary alert—check it out!
</div>
<div class="alert alert-success" role="alert">
A simple success alert—check it out!
</div>
<div class="alert alert-danger" role="alert">
A simple danger alert—check it out!
</div>
<div class="alert alert-warning alert-dismissible fade show" role="alert">
<strong>Holy guacamole!</strong> You should check in on some of those fields below.
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
<hr>
<h5>Alerts with Icons</h5>
<div class="alert alert-primary d-flex align-items-center" role="alert">
<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
<div>An example alert with an icon</div>
</div>
<div class="alert alert-success d-flex align-items-center" role="alert">
<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
<div>An example success alert with an icon</div>
</div>
<div class="alert alert-warning d-flex align-items-center" role="alert">
<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
<div>An example warning alert with an icon</div>
</div>
<div class="alert alert-danger d-flex align-items-center" role="alert">
<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
<div>An example danger alert with an icon</div>
</div>`,

  badge: `<h1>Example heading <span class="badge bg-secondary">New</span></h1>
<h2>Example heading <span class="badge bg-secondary">New</span></h2>
<h3>Example heading <span class="badge bg-secondary">New</span></h3>
<hr>
<span class="badge text-bg-primary">Primary</span>
<span class="badge text-bg-secondary">Secondary</span>
<span class="badge text-bg-success">Success</span>
<span class="badge text-bg-danger">Danger</span>
<span class="badge text-bg-warning">Warning</span>
<span class="badge text-bg-info">Info</span>
<hr>
<span class="badge rounded-pill text-bg-primary">Primary</span>
<span class="badge rounded-pill text-bg-secondary">Secondary</span>
<span class="badge rounded-pill text-bg-success">Success</span>`,

  breadcrumb: `<nav aria-label="breadcrumb">
<ol class="breadcrumb">
  <li class="breadcrumb-item"><a href="#">Home</a></li>
  <li class="breadcrumb-item"><a href="#">Library</a></li>
  <li class="breadcrumb-item active" aria-current="page">Data</li>
</ol>
</nav>`,

  buttons: `<div class="mb-3">
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-light">Light</button>
<button type="button" class="btn btn-dark">Dark</button>
<button type="button" class="btn btn-link">Link</button>
</div>
<div class="mb-3">
<button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
</div>
<div>
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-secondary btn-sm">Small button</button>
</div>`,

  buttonGroup: `<div class="btn-group" role="group" aria-label="Basic example">
<button type="button" class="btn btn-primary">Left</button>
<button type="button" class="btn btn-primary">Middle</button>
<button type="button" class="btn btn-primary">Right</button>
</div>`,

  carousel: `<div id="carouselExample" class="carousel slide">
<div class="carousel-indicators">
  <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
  <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
  <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
</div>
<div class="carousel-inner">
  <div class="carousel-item active">
    <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="d-block w-100" alt="...">
    <div class="carousel-caption d-none d-md-block">
      <h5>First slide label</h5>
      <p>Some representative placeholder content for the first slide.</p>
    </div>
  </div>
  <div class="carousel-item">
    <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="d-block w-100" alt="...">
    <div class="carousel-caption d-none d-md-block">
      <h5>Second slide label</h5>
      <p>Some representative placeholder content for the second slide.</p>
    </div>
  </div>
  <div class="carousel-item">
    <img src="https://university-game.tiltroleplay.com/wp-content/uploads/2026/08/screenshot.png" class="d-block w-100" alt="...">
    <div class="carousel-caption d-none d-md-block">
      <h5>Third slide label</h5>
      <p>Some representative placeholder content for the third slide.</p>
    </div>
  </div>
</div>
<button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
  <span class="carousel-control-next-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Next</span>
</button>
</div>`,

  collapse: `<p class="d-inline-flex gap-1">
<a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
  Link with href
</a>
<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
  Button with data-bs-target
</button>
</p>
<div class="collapse" id="collapseExample">
<div class="card card-body">
  Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
</div>
</div>`,

  dropdowns: `<div class="dropdown">
<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
  Dropdown button
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><hr class="dropdown-divider"></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div>
<hr>
<div class="btn-group">
<button type="button" class="btn btn-danger">Action</button>
<button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
  <span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
  <li><a class="dropdown-item" href="#">Another action</a></li>
  <li><a class="dropdown-item" href="#">Something else here</a></li>
</ul>
</div>`,

  modal: `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
Launch demo modal
</button>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p>Modal body text goes here.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </div>
</div>
</div>`,

  offcanvas: `<a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
Link with href
</a>
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
Button with data-bs-target
</button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
<div class="offcanvas-header">
  <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
</div>
<div class="offcanvas-body">
  <div>
    Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
  </div>
  <div class="dropdown mt-3">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      Dropdown button
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
    </ul>
  </div>
</div>
</div>`,

  pagination: `<nav aria-label="Page navigation example">
<ul class="pagination">
  <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  <li class="page-item"><a class="page-link" href="#">1</a></li>
  <li class="page-item active"><a class="page-link" href="#">2</a></li>
  <li class="page-item"><a class="page-link" href="#">3</a></li>
  <li class="page-item">
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
</ul>
</nav>`,

  progress: `<div class="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
<div class="progress-bar" style="width: 25%"></div>
</div>
<div class="progress mb-3" role="progressbar" aria-label="Success example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
<div class="progress-bar bg-success" style="width: 50%"></div>
</div>
<div class="progress mb-3" role="progressbar" aria-label="Info example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
<div class="progress-bar bg-info text-dark" style="width: 75%">75%</div>
</div>
<div class="progress" role="progressbar" aria-label="Striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
</div>`,

  spinners: `<div class="spinner-border text-primary" role="status">
<span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border text-secondary" role="status"></div>
<div class="spinner-border text-success" role="status"></div>
<div class="spinner-border text-danger" role="status"></div>
<hr>
<div class="spinner-grow text-primary" role="status">
<span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-grow text-secondary" role="status"></div>
<div class="spinner-grow text-success" role="status"></div>
<hr>
<button class="btn btn-primary" type="button" disabled>
<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
<span role="status">Loading...</span>
</button>`,

  toasts: `<div class="toast-container position-static">
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">Bootstrap</strong>
    <small class="text-muted">just now</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    See? Just like this.
  </div>
</div>
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">Bootstrap</strong>
    <small class="text-muted">2 seconds ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    Heads up, toasts will stack automatically
  </div>
</div>
</div>`,

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================

  navbar: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
<div class="container-fluid">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Dropdown
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
      </li>
    </ul>
    <form class="d-flex" role="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </div>
</div>
</nav>`,

  navTabs: `<ul class="nav nav-tabs">
<li class="nav-item">
  <a class="nav-link active" aria-current="page" href="#">Active</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="#">Link</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="#">Link</a>
</li>
<li class="nav-item">
  <a class="nav-link disabled" aria-disabled="true">Disabled</a>
</li>
</ul>`,

  navPills: `<ul class="nav nav-pills">
<li class="nav-item">
  <a class="nav-link active" aria-current="page" href="#">Active</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="#">Link</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="#">Link</a>
</li>
<li class="nav-item">
  <a class="nav-link disabled" aria-disabled="true">Disabled</a>
</li>
</ul>`,

  tabs: `<ul class="nav nav-tabs" id="myTab" role="tablist">
<li class="nav-item" role="presentation">
  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
</li>
<li class="nav-item" role="presentation">
  <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
</li>
<li class="nav-item" role="presentation">
  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button>
</li>
</ul>
<div class="tab-content" id="myTabContent">
<div class="tab-pane fade show active p-3" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
  <h5>Home Tab</h5>
  <p>This is some placeholder content for the Home tab.</p>
</div>
<div class="tab-pane fade p-3" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
  <h5>Profile Tab</h5>
  <p>This is some placeholder content for the Profile tab.</p>
</div>
<div class="tab-pane fade p-3" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
  <h5>Contact Tab</h5>
  <p>This is some placeholder content for the Contact tab.</p>
</div>
</div>`,

  // ==========================================================================
  // FORMS
  // ==========================================================================

  formBasic: `<form>
<div class="mb-3">
  <label for="exampleInputEmail1" class="form-label">Email address</label>
  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
</div>
<div class="mb-3">
  <label for="exampleInputPassword1" class="form-label">Password</label>
  <input type="password" class="form-control" id="exampleInputPassword1">
</div>
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="exampleCheck1">
  <label class="form-check-label" for="exampleCheck1">Check me out</label>
</div>
<button type="submit" class="btn btn-primary">Submit</button>
</form>`,

  formFloating: `<form>
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>
<div class="form-floating mb-3">
  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
</div>
<div class="form-floating">
  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea" style="height: 100px"></textarea>
  <label for="floatingTextarea">Comments</label>
</div>
</form>`,

  inputGroup: `<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">@</span>
<input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
</div>
<div class="input-group mb-3">
<input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
<span class="input-group-text" id="basic-addon2">@example.com</span>
</div>
<div class="input-group mb-3">
<span class="input-group-text">$</span>
<input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
<span class="input-group-text">.00</span>
</div>
<div class="input-group">
<input type="text" class="form-control" placeholder="Search...">
<button class="btn btn-outline-secondary" type="button">
  <i class="bi bi-search"></i>
</button>
</div>`,

  formSelect: `<select class="form-select mb-3" aria-label="Default select example">
<option selected>Open this select menu</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
</select>
<select class="form-select form-select-lg mb-3" aria-label="Large select example">
<option selected>Large select</option>
<option value="1">One</option>
<option value="2">Two</option>
</select>
<select class="form-select form-select-sm" aria-label="Small select example">
<option selected>Small select</option>
<option value="1">One</option>
<option value="2">Two</option>
</select>`,

  formChecks: `<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
<label class="form-check-label" for="flexCheckDefault">Default checkbox</label>
</div>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
<label class="form-check-label" for="flexCheckChecked">Checked checkbox</label>
</div>
<hr>
<div class="form-check">
<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
<label class="form-check-label" for="flexRadioDefault1">Default radio</label>
</div>
<div class="form-check">
<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
<label class="form-check-label" for="flexRadioDefault2">Checked radio</label>
</div>
<hr>
<div class="form-check form-switch">
<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
<label class="form-check-label" for="flexSwitchCheckDefault">Default switch</label>
</div>
<div class="form-check form-switch">
<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
<label class="form-check-label" for="flexSwitchCheckChecked">Checked switch</label>
</div>`,

  formRange: `<label for="customRange1" class="form-label">Example range</label>
<input type="range" class="form-range" id="customRange1">
<label for="customRange2" class="form-label">Range with min/max</label>
<input type="range" class="form-range" min="0" max="5" id="customRange2">
<label for="customRange3" class="form-label">Range with steps</label>
<input type="range" class="form-range" min="0" max="5" step="0.5" id="customRange3">`
}

/**
 * Display names for examples (shown in dropdown)
 * @type {Object.<string, string>}
 */
export const exampleNames = {
  // Layout Patterns
  jumbotron: 'Jumbotron',
  features: 'Features Grid',
  cta: 'Call to Action',
  pricing: 'Pricing Cards',

  // Content
  card: 'Card',
  cardGroup: 'Card Group',
  listGroup: 'List Group',
  table: 'Table',
  figures: 'Figures',

  // Components
  accordion: 'Accordion',
  alerts: 'Alerts',
  badge: 'Badges',
  breadcrumb: 'Breadcrumb',
  buttons: 'Buttons',
  buttonGroup: 'Button Group',
  carousel: 'Carousel',
  collapse: 'Collapse',
  dropdowns: 'Dropdowns',
  modal: 'Modal',
  offcanvas: 'Offcanvas',
  pagination: 'Pagination',
  progress: 'Progress',
  spinners: 'Spinners',
  toasts: 'Toasts',

  // Navigation
  navbar: 'Navbar',
  navTabs: 'Nav Tabs',
  navPills: 'Nav Pills',
  tabs: 'Tabs',

  // Forms
  formBasic: 'Basic Form',
  formFloating: 'Floating Labels',
  inputGroup: 'Input Group',
  formSelect: 'Select',
  formChecks: 'Checks & Radios',
  formRange: 'Range'
}

/**
 * Example categories for dropdown organization
 * Maps category names to arrays of example keys
 * @type {Object.<string, string[]>}
 */
export const exampleCategories = {
  'Layout Patterns': ['jumbotron', 'features', 'cta', 'pricing'],
  'Content': ['card', 'cardGroup', 'listGroup', 'table', 'figures'],
  'Components': [
    'accordion', 'alerts', 'badge', 'breadcrumb', 'buttons',
    'buttonGroup', 'carousel', 'collapse', 'dropdowns', 'modal',
    'offcanvas', 'pagination', 'progress', 'spinners', 'toasts'
  ],
  'Navigation': ['navbar', 'navTabs', 'navPills', 'tabs'],
  'Forms': ['formBasic', 'formFloating', 'inputGroup', 'formSelect', 'formChecks', 'formRange']
}

/**
 * Examples not fully developed (output as wp:html block)
 * These components require Bootstrap JS and are wrapped as raw HTML blocks
 * @type {string[]}
 */
export const notDevelopedExamples = [
  'carousel', 'modal', 'offcanvas', 'pagination', 'progress', 'spinners', 'toasts'
]

export default examples
