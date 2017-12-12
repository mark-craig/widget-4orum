const csjs = require('csjs-inject');


module.exports = csjs`
  /*
  * -- COMMENT STYLES --
  */
  .comment {
      /* Add shadows to create the "card" effect */
      -webkit-box-shadow: 0 0.125em 0.25em 0 rgba(0,0,0,0.2);
              box-shadow: 0 0.125em 0.25em 0 rgba(0,0,0,0.2);
      -webkit-transition: 0.3s;
      -o-transition: 0.3s;
      transition: 0.3s;
      margin: 0em;
      font-size: 0.75em;

  }

  /* On mouse-over, add a deeper shadow */
  .comment:hover {
      -webkit-box-shadow: 0 0.25em 0.5em 0 rgba(0,0,0,0.2);
              box-shadow: 0 0.25em 0.5em 0 rgba(0,0,0,0.2);
  }

  .comment-header {
    height: auto;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding-left: 2em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    text-align: left;
    color: white;
    font-weight: bold;
    font-size: larger;
  }

  /* Add some padding inside the card container */
  .comment-body {
      padding: 0.0em 1em;
      overflow-wrap: break-word;
  }

  .comment-footer {
    text-align: right;
  }

  .timestamp {
    float:right;
    padding-right:1em;
    padding-top: 0.25em;
  }

  .comment-group {
    outline-style: solid;
    outline-width: 0.1em;
    outline-color: #E8E8E8;
    margin-bottom: 1em;
  }

  a.reference {
    color: white;
    border-bottom: 0.02em dashed;
    font-weight: bold
  }

  .continue-thread {
    height: auto;
  }

  .logo {
    height:0.9em;
  }

  .loading {
    width: 10%;
    margin-left: 45%;
    margin-right: 45%;
    margin-top: 5%;
    -webkit-animation: spin 4s infinite linear;
  }


  @-webkit-keyframes spin {
  0%  {-webkit-transform: rotate(0deg);}
  100% {-webkit-transform: rotate(360deg);}
  }

  /*On small screens, labels should be hidden, icons should be twice as big*/
  .menu-label {
    visibility: hidden;
    font-size: 0;
  }
  .menu-icon {
    font-size: 2em
  }

  ul {
    list-style-type: none;
  }

  .pure-button {
    padding: 0.25em;
  }

  .smaller-button {
    font-size: 85%;
  }

  .larger-button {
    font-size: 130%;
  }

  .alert-error {
    position: relative;
    margin-bottom: 1em;
    padding: 0.5em;
    background-color: orange;
    color: #fff;
  }

  .no-sentiment {
    background-color: whitesmoke;
    color: #404040;
  }

  .continue-thread-button {
    background-color: silver;
    width: 100%;
    font-size: 0.75em;
  }

  .cancel-button {
    background-color: rgba(255, 0, 0, 1);
    color: white;
    float:right;
  }

  .blank {
    height: 1em;
  }

  .sentiment-message {
    text-align: center;
    margin: 1em;
  }

  .nav-button {
    margin-bottom: 1em;
  }

  /*
  * -- LARGE PHONES --
  On screens that are not extra small
  */
  @media (min-width: 36em) {
    .menu-label {
      visibility: visible;
      font-size: 100%;
    }
    .menu-icon {
      font-size: 1.3em
    }
  }

  /*
   * -- TABLET (AND UP) MEDIA QUERIES --
   * On tablets and other medium-sized devices, we want to customize some
   * of the mobile styles.
   */
  @media (min-width: 48em) {

      /* We increase the body font size */
      body {
          font-size: 16px;
      }

      /* We can align the menu header to the left, but float the
      menu items to the right. */
      .home-menu {
          text-align: left;
      }
          .home-menu ul {
              float: right;
          }

      .content {
          padding: 2em 3em 0;
      }

      .header {
          text-align: right;
      }

      .footer {
          text-align: center;
      }
  }

  /*
   * -- DESKTOP (AND UP) MEDIA QUERIES --
   * On desktops and other large devices, we want to over-ride some
   * of the mobile and tablet styles.
   */
  @media (min-width: 64em) {
    /*If we have enough space to show them side-by-side, keep the main comment
    on the left in detail view*/
      .main-comment {
        position: -webkit-sticky;
        position: sticky;
        top: 4em;
      }
    }
`;
