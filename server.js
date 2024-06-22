const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const redmineUrl = 'http://127.0.0.1/redmine/issues.json';
const auth = {
  user: 'felix',
  pass: 'changeme'
};

app.post('/create-issue', async (req, res) => {
  const subject = req.body.subject;

  const issueData = {
    issue: {
      project_id: 1,
      tracker_id: 1,
      priority_id: 2,
      subject: subject,
      description: 'This issue is created via *API*',
      assigned_to_id: 1,
      due_date: '2025-02-28',
      estimated_hours: 8
    }
  };

  try {
    const response = await fetch(redmineUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${auth.user}:${auth.pass}`).toString('base64')
      },
      body: JSON.stringify(issueData)
    });

    if (response.ok) {
      res.json({ success: true });
    } else {
      const errorData = await response.json();
      res.json({ success: false, message: errorData.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});