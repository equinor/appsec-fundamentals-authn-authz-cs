<!-- markdownlint-disable MD033 -->

# What problem are we trying to solve?

---

## A day in the life of a modern Web app

![Modern Web App](content/images/modernapp.png)

Note:

- Show the application running from ex-10
- Log-in, request email, perhaps some episodes

---

### The delegation problem

Giving Access to 3rd parties. API's are a driving force!

---

### "Old style" A&A

<table>
  <tr>
    <td><img src="content/images/my_super_app_old.jpg"></td>
    <td style=" vertical-align: middle;">
      <ul>  <!-- .element style="font-size: 0.8em"-->
        <li>Impersonation, direct authentication</li> 
        <li>Store id/password for each service in all apps</li> 
        <li>No way to revoke app access</li>
        <li>Access is not time limited</li>
        <li>Full access only – not granular</li>
      </ul>
    </td>
  </tr>
</table>

---

### "New style" A&A

<table>
  <tr>
    <td><img src="content/images/my_super_app_new.jpg"></td>
    <td style=" vertical-align: middle;">
      <ul> <!-- .element style="font-size: 0.8em"-->
        <li>Access is delegated (from resource owner to client)</li>
        <li>Passwords not stored on client</li>
        <li>Access can be revoked</li>
        <li>Access can be time limited</li>
        <li>Access can be granular</li>
      </ul>
    </td>
  </tr>
</table>
