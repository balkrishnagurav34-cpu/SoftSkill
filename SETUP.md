# Save feedback and contacts to Google Sheets (downloadable as Excel)

1. Create a new Google Sheet (e.g. "Skillverse Data").
2. Extensions → Apps Script. Delete the sample code, paste in `apps-script/Code.gs`, and Save.
3. Deploy → New deployment → type **Web app**.
   Execute as: **Me**. Who has access: **Anyone**. Click Deploy and allow access.
4. Copy the **Web app URL** and paste it into `config.js` as `SHEET_URL`.
5. Upload the site files to your host.

What lands where:
- Feedback form → tab **Feedback** (shown on the Review page, emails are never shown).
- Contact form (name, email, phone, message) → tab **Contacts** (private: the website never reads this tab back).

- Excel file: in the sheet use File → Download → Microsoft Excel (.xlsx).
- Remove a review from the website: delete its row in the Feedback tab.
- After editing Code.gs later, use Deploy → Manage deployments → Edit → New version.
- If you deployed an older Code.gs before, paste this new one and deploy a new version, otherwise contacts will not go to the Contacts tab.
- Until `SHEET_URL` is set, feedback and contacts are stored only in each visitor's own browser (demo mode), so you will not receive them.

## Skills page
The 8 skills match the 8 planets. Scrolling down or up the Skills section flies the camera from Mercury to Neptune (and back). Edit the text in the `skills` list at the top of `script.js`.
