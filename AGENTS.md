## Project Info
- All source files are on local Windows machine
- Production server: myec2
- App location on EC2: /var/app
- Process manager: PM2 (app name: myapp)

## Deployment Steps
1. git add . && git commit -m "your message"
2. git push origin main
3. ssh myec2 "cd /var/app && git pull && npm install && pm2 restart myapp"
4. ssh myec2 "pm2 status"

## Useful Commands
- View logs: ssh myec2 "pm2 logs myapp --lines 100"
- Restart app: ssh myec2 "pm2 restart myapp"
- Server status: ssh myec2 "pm2 status"
- Disk/memory: ssh myec2 "df -h && free -m"

## Bug Fix Workflow
1. Fix bug locally on Windows
2. Test locally
3. Commit and push to GitHub
4. Deploy using deployment steps above
5. Check logs to confirm fix