Please follow the initial steps, and I will share the remaining steps afterward.

To connect a GitHub Pages site to your custom domain:
1. Enable GitHub Pages
Open your GitHub repository.
Go to Settings → Pages.
Under Build and deployment, choose:
* Deploy from a branch, then select your publishing branch, usually main, or
* GitHub Actions, if your site uses a workflow.
Note your GitHub Pages address.
You at 13:08, Sep 3:
give me all detail , i will do later
Baljeet K at 13:13, Sep 3:
2. Add the custom domain in GitHub
In Settings → Pages, under Custom domain
Click Save.
GitHub may create a CNAME file in your repository automatically.
Baljeet K at 13:13, Sep 3:
3. Configure DNS at your domain registrar
Please navigate to the DNS settings at your domain registrar.
Recommended setup: 'www' and the root domain.
Preview attachment - PNG
You at 13:14, Sep 3:
ok
Baljeet K at 13:14, Sep 3:
4. Please wait for DNS propagation.
DNS changes can take a few minutes to process, but in some cases, this may extend to 24–48 hours.

Once propagation is complete, please navigate to GitHub → Settings → Pages and enable the "Enforce HTTPS" option. This option may take some time to become available after your DNS has been configured.
5. Please check for conflicts.
Remove any old or conflicting DNS records, especially:
* Existing A records pointing elsewhere
* Existing CNAME records for www
* Domain forwarding rules from your registrar