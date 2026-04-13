# Readme

### How to update cmu website: 

alias updateWeb="scp -r /home/abhijat/gitstuff/abhijatb_andrewweb/*  abhijatb@unix.andrew.cmu.edu:www/; 
scp -r /home/abhijat/gitstuff/abhijatb_andrewweb/*  cmuscsLinux:~/www/; 
echo Publish andrew website at: http://www.andrew.cmu.edu/server/publish.html"

On WSL:
alias updateWeb="scp -r /mnt/c/Users/Abhijat/Downloads/personal_website_stuff/abhijat_web_curr/*  abhijatb@unix.andrew.cmu.edu:www/; 
scp -r /mnt/c/Users/Abhijat/Downloads/personal_website_stuff/abhijat_web_curr/*  abhijatb@linux.gp.cs.cmu.edu:~/www/; 
echo Publish andrew website at: http://www.andrew.cmu.edu/server/publish.html"



### Site maintenance notes

- Styles now live in `assets/site.css`.
- Page-level JS now lives in `assets/site.js`.
- Dark mode now uses the local `assets/darkmode-js.js` bundle.

### Optional data-driven workflow for updates

- Starter content template: `data/site-content.template.json`
- Row generation helper: `scripts/render-updates.js`
- Workflow docs: `scripts/content-workflow.md`

### Optional data-driven workflow for research and projects

- Research data template: `data/publications.template.json`
- Projects data template: `data/projects.template.json`
- Research row generator: `scripts/render-publications.js`
- Project row generator: `scripts/render-projects.js`

### Optional data-driven workflow for intro/profile

- Intro data template: `data/intro.template.json`
- Intro block generator: `scripts/render-intro.js`

### Build all generated sections

- Build script: `scripts/build-site.js`
- Python fallback build script: `scripts/build-site.py`
- Command (recommended here): `py scripts/build-site.py`
- Node command (if installed): `node scripts/build-site.js`
- This refreshes intro, updates, research, and projects blocks inside `index.html`.
