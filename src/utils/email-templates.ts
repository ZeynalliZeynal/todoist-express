export const verifyEmailTemplate = (url: string) => ({
  subject: "Verify Email",
  text: "Click to verify email",
  html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" v="urn:schemas-microsoft-com:vml" o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title></title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]>-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
none;
none !important
}
img {
0;
0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
line-height: inherit;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
100%!important;
max-width: 100%!important;
inline-block!important;
0;
0;
0
}
a[x-apple-data-detectors] {
inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (min-width: 481px) {
.hd { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t34,.t42{width:480px!important}.t28,.t36{text-align:center!important}.t27{vertical-align:top!important;width:600px!important}
}
</style>
<!--[if !mso]>-->
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500;600;700&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id="body" class="t46" style="min-width:100%;Margin:0px;padding:0px;background-color:#F0F0F0;"><div class="t45" style="background-color:#F0F0F0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t44" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#F0F0F0;" valign="top" align="center">
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color="#F0F0F0"/>
</v:background>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td align="center">
<table class="t35" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="600" class="t34" style="background-color:#FFFFFF;width:600px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t34" style="background-color:#FFFFFF;width:600px;">
<!--<![endif]-->
<table class="t33" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t32"><div class="t31" style="width:100%;text-align:center;"><div class="t30" style="display:inline-block;"><table class="t29" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
<tr class="t28"><td></td><td class="t27" width="600" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t26" style="width:100%;"><tr>
<td class="t25" style="background-color:transparent;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td><div class="t1" style="mso-line-height-rule:exactly;mso-line-height-alt:125px;line-height:125px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t5" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="40" class="t4" style="width:40px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t4" style="width:40px;">
<!--<![endif]-->
<table class="t3" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t2"><div style="font-size:0px;"><svg
      height="64"
      width="64"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.88 0H5.12C2.2923 0 0 2.2923 0 5.12V26.88C0 29.7077 2.2923 32 5.12 32H26.88C29.7077 32 32 29.7077 32 26.88V5.12C32 2.2923 29.7077 0 26.88 0Z"
        fill="#0A0A0A"
      />
      <path
        d="M6.76398 14.993L13.138 11.325L13.146 11.32L19.714 7.54001C19.991 7.38001 20.004 6.89001 19.694 6.71201L19.477 6.58801C19.16 6.40801 18.75 6.17401 18.575 6.07201C18.4217 5.98853 18.2495 5.94579 18.0749 5.94789C17.9003 5.94999 17.7292 5.99686 17.578 6.08401C17.423 6.17401 7.07698 12.122 6.73098 12.319C6.5271 12.4356 6.29632 12.4969 6.06148 12.4969C5.82663 12.4969 5.59586 12.4356 5.39198 12.319L-0.0720215 9.14401V11.843L-0.0160215 11.875C1.34798 12.67 4.57598 14.55 5.36598 14.995C5.84498 15.265 6.30298 15.259 6.76398 14.993Z"
        fill="#fff"
      />
      <path
        d="M6.76398 20.385L13.13 16.721L13.154 16.707L19.714 12.932C19.991 12.772 20.004 12.281 19.694 12.104L19.477 11.98C19.161 11.8 18.75 11.566 18.575 11.464C18.4217 11.3805 18.2495 11.3378 18.0749 11.3399C17.9003 11.342 17.7292 11.3889 17.578 11.476C17.423 11.565 7.07698 17.514 6.73098 17.71C6.5271 17.8266 6.29632 17.8879 6.06148 17.8879C5.82663 17.8879 5.59586 17.8266 5.39198 17.71C5.06598 17.522 -0.0720215 14.536 -0.0720215 14.536V17.234L-0.0160215 17.267C1.34898 18.062 4.57598 19.941 5.36598 20.387C5.84498 20.657 6.30298 20.651 6.76398 20.385Z"
        fill="#fff"
      />
      <path
        d="M13.139 22.108L6.76398 25.777C6.30298 26.043 5.84398 26.049 5.36598 25.779C4.57598 25.333 1.34898 23.454 -0.0160215 22.659L-0.0720215 22.626V19.928L5.39198 23.102C5.80498 23.341 6.31698 23.338 6.73098 23.102C7.07698 22.906 17.423 16.957 17.578 16.867C17.7292 16.7799 17.9003 16.733 18.0749 16.7309C18.2495 16.7288 18.4217 16.7715 18.575 16.855C18.9472 17.0703 19.3205 17.2836 19.695 17.495C20.005 17.673 19.991 18.164 19.714 18.324L13.139 22.108Z"
        fill="#fff"
      />
    </svg></div></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t7" style="mso-line-height-rule:exactly;mso-line-height-alt:55px;line-height:55px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t11" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="315" class="t10" style="width:315px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t10" style="width:315px;">
<!--<![endif]-->
<table class="t9" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t8"><h1 class="t6" style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:52px;font-weight:700;font-style:normal;font-size:48px;text-decoration:none;text-transform:none;direction:ltr;color:#000000;text-align:center;mso-line-height-rule:exactly;mso-text-raise:1px;">Verify email</h1></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t12" style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t17" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="350" class="t16" style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t16" style="width:350px;">
<!--<![endif]-->
<table class="t15" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t14"><p class="t13" style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:500;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;">To verify your email, click the button below.</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t19" style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t23" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="308" class="t22" style="background-color:#0A0A0A;overflow:hidden;width:308px;border-radius:14px 14px 14px 14px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t22" style="background-color:#0A0A0A;overflow:hidden;width:308px;border-radius:14px 14px 14px 14px;">
<!--<![endif]-->
<table class="t21" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t20" style="text-align:center;line-height:58px;mso-line-height-rule:exactly;mso-text-raise:11px;"><a class="t18" href=${url} style="display:block;margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:58px;font-weight:600;font-style:normal;font-size:21px;text-decoration:none;direction:ltr;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:11px;" target="_blank">Verify your email</a></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t24" style="mso-line-height-rule:exactly;mso-line-height-alt:60px;line-height:60px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr></table></td>
</tr></table>
</td>
<td></td></tr>
</table></div></div></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td align="center">
<table class="t43" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="600" class="t42" style="background-color:transparent;width:600px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t42" style="background-color:transparent;width:600px;">
<!--<![endif]-->
<table class="t41" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t40"><div class="t39" style="width:100%;text-align:center;"><div class="t38" style="display:inline-block;"><table class="t37" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
<tr class="t36"><td></td>
<td></td></tr>
</table></div></div></td>
</tr></table>
</td>
</tr></table>
</td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
</html>`,
});

export const resetPasswordEmailTemplate = (url: string) => ({
  subject: "Reset Password",
  text: "Click to reset your password",
  html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title></title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]>-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
line-height: inherit;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (min-width: 481px) {
.hd { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t41{width:480px!important}.t35{text-align:center!important}.t34{vertical-align:top!important;width:600px!important}
}
</style>
<!--[if !mso]>-->
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500;600;700&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id="body" class="t45" style="min-width:100%;Margin:0px;padding:0px;background-color:#F0F0F0;"><div class="t44" style="background-color:#F0F0F0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t43" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#F0F0F0;" valign="top" align="center">
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color="#F0F0F0"/>
</v:background>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td align="center">
<table class="t42" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="600" class="t41" style="background-color:#FFFFFF;width:600px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t41" style="background-color:#FFFFFF;width:600px;">
<!--<![endif]-->
<table class="t40" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t39"><div class="t38" style="width:100%;text-align:center;"><div class="t37" style="display:inline-block;"><table class="t36" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
<tr class="t35"><td></td><td class="t34" width="600" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t33" style="width:100%;"><tr>
<td class="t32" style="background-color:transparent;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td><div class="t1" style="mso-line-height-rule:exactly;mso-line-height-alt:60px;line-height:60px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t5" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="64" class="t4" style="width:64px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t4" style="width:64px;">
<!--<![endif]-->
<table class="t3" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t2"><div style="font-size:0px;"><svg
      height="64"
      width="64"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.88 0H5.12C2.2923 0 0 2.2923 0 5.12V26.88C0 29.7077 2.2923 32 5.12 32H26.88C29.7077 32 32 29.7077 32 26.88V5.12C32 2.2923 29.7077 0 26.88 0Z"
        fill="#0A0A0A"
      />
      <path
        d="M6.76398 14.993L13.138 11.325L13.146 11.32L19.714 7.54001C19.991 7.38001 20.004 6.89001 19.694 6.71201L19.477 6.58801C19.16 6.40801 18.75 6.17401 18.575 6.07201C18.4217 5.98853 18.2495 5.94579 18.0749 5.94789C17.9003 5.94999 17.7292 5.99686 17.578 6.08401C17.423 6.17401 7.07698 12.122 6.73098 12.319C6.5271 12.4356 6.29632 12.4969 6.06148 12.4969C5.82663 12.4969 5.59586 12.4356 5.39198 12.319L-0.0720215 9.14401V11.843L-0.0160215 11.875C1.34798 12.67 4.57598 14.55 5.36598 14.995C5.84498 15.265 6.30298 15.259 6.76398 14.993Z"
        fill="#fff"
      />
      <path
        d="M6.76398 20.385L13.13 16.721L13.154 16.707L19.714 12.932C19.991 12.772 20.004 12.281 19.694 12.104L19.477 11.98C19.161 11.8 18.75 11.566 18.575 11.464C18.4217 11.3805 18.2495 11.3378 18.0749 11.3399C17.9003 11.342 17.7292 11.3889 17.578 11.476C17.423 11.565 7.07698 17.514 6.73098 17.71C6.5271 17.8266 6.29632 17.8879 6.06148 17.8879C5.82663 17.8879 5.59586 17.8266 5.39198 17.71C5.06598 17.522 -0.0720215 14.536 -0.0720215 14.536V17.234L-0.0160215 17.267C1.34898 18.062 4.57598 19.941 5.36598 20.387C5.84498 20.657 6.30298 20.651 6.76398 20.385Z"
        fill="#fff"
      />
      <path
        d="M13.139 22.108L6.76398 25.777C6.30298 26.043 5.84398 26.049 5.36598 25.779C4.57598 25.333 1.34898 23.454 -0.0160215 22.659L-0.0720215 22.626V19.928L5.39198 23.102C5.80498 23.341 6.31698 23.338 6.73098 23.102C7.07698 22.906 17.423 16.957 17.578 16.867C17.7292 16.7799 17.9003 16.733 18.0749 16.7309C18.2495 16.7288 18.4217 16.7715 18.575 16.855C18.9472 17.0703 19.3205 17.2836 19.695 17.495C20.005 17.673 19.991 18.164 19.714 18.324L13.139 22.108Z"
        fill="#fff"
      />
    </svg></div></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t7" style="mso-line-height-rule:exactly;mso-line-height-alt:55px;line-height:55px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t11" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="315" class="t10" style="width:315px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t10" style="width:315px;">
<!--<![endif]-->
<table class="t9" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t8"><h1 class="t6" style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:52px;font-weight:700;font-style:normal;font-size:48px;text-decoration:none;text-transform:none;direction:ltr;color:#000000;text-align:center;mso-line-height-rule:exactly;mso-text-raise:1px;">Forgot Password?</h1></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t12" style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t17" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="350" class="t16" style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t16" style="width:350px;">
<!--<![endif]-->
<table class="t15" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t14"><p class="t13" style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:500;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;">To reset your password, click the button below.&nbsp;</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td align="center">
<table class="t24" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="350" class="t23" style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t23" style="width:350px;">
<!--<![endif]-->
<table class="t22" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t21"><p class="t20" style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:500;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;"><span class="t19" style="margin:0;Margin:0;mso-line-height-rule:exactly;"><span class="t18" style="margin:0;Margin:0;font-style:italic;mso-line-height-rule:exactly;">Only available for 5 minutes.</span></span></p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t26" style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t30" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="308" class="t29" style="background-color:#0A0A0A;overflow:hidden;width:308px;border-radius:14px 14px 14px 14px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t29" style="background-color:#0A0A0A;overflow:hidden;width:308px;border-radius:14px 14px 14px 14px;">
<!--<![endif]-->
<table class="t28" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr>
<td class="t27" style="text-align:center;line-height:58px;mso-line-height-rule:exactly;mso-text-raise:11px;"><a class="t25" href="https://tabular.email" style="display:block;margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:58px;font-weight:600;font-style:normal;font-size:21px;text-decoration:none;direction:ltr;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:11px;" target="_blank">Verify your email</a></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class="t31" style="mso-line-height-rule:exactly;mso-line-height-alt:60px;line-height:60px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr></table></td>
</tr></table>
</td>
<td></td></tr>
</table></div></div></td>
</tr></table>
</td>
</tr></table>
</td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
</html>`,
});
