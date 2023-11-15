# EX-6 - Common Authorization Scenarios

In this section we will explore a few common authorization (and authentication) scenarios and how to configure these in Microsoft Entra ID.

A typical way of implementing authorization in Equinor is to use AD (Active Directory) groups. Users apply for access to "something" in Access@IT. If approved, the user is added to a AD group. AD groups and members are synced to AAD (Azure Active Directory). Applications use the group membership to implement access control.

## Scenarios

* [Scenario 1](doc/scenario_1.md): Only people with a valid account should be able to sign-in
* [Scenario 2](doc/scenario_2.md): Only people being part of specific groups (AD groups) should have access
