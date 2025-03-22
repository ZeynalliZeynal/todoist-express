import { UserDocument } from "../model/user.model";

export const otpVerificationEmail = ({
  username,
  otp,
  url,
  auth,
  location,
}: {
  username: string;
  otp: string;
  url: string;
  auth: "log in" | "sign up";
  location: UserDocument["location"];
}) => ({
  subject: `${otp} - Todoist NEXT ${auth === "log in" ? "Login" : "Signup"} Verification`,
  text: "OTP code for email verification",
  html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="format-detection" content="telephone=no"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Todoist NEXT Sign-in Verification</title><style type="text/css" emogrify="no">#outlook a { padding:0; } .ExternalClass { width:100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } table td { border-collapse: collapse; mso-line-height-rule: exactly; } .editable.image { font-size: 0 !important; line-height: 0 !important; } .nl2go_preheader { display: none !important; mso-hide:all !important; mso-line-height-rule: exactly; visibility: hidden !important; line-height: 0px !important; font-size: 0px !important; } body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; } img { outline:none; text-decoration:none; -ms-interpolation-mode: bicubic; } a img { border:none; } table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; } th { font-weight: normal; text-align: left; } *[class="gmail-fix"] { display: none !important; } </style><style type="text/css" emogrify="no"> @media (max-width: 600px) { .gmx-killpill { content: ' \\03D1';} } </style><style type="text/css" emogrify="no">@media (max-width: 600px) { .gmx-killpill { content: ' \\03D1';} .r0-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 320px !important } .r1-i { background-color: #ffffff !important } .r2-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 100% !important } .r3-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } .r4-i { background-color: #ffffff !important; padding-bottom: 20px !important; padding-left: 15px !important; padding-right: 15px !important; padding-top: 20px !important } .r5-c { box-sizing: border-box !important; display: block !important; valign: top !important; width: 100% !important } .r6-o { border-style: solid !important; width: 100% !important } .r7-i { padding-left: 0px !important; padding-right: 0px !important } .r8-i { padding-bottom: 20px !important; padding-left: 0px !important; padding-right: 0px !important; padding-top: 20px !important } .r9-c { box-sizing: border-box !important; text-align: left !important; valign: top !important; width: 100% !important } .r10-o { border-style: solid !important; margin: 0 auto 0 0 !important; width: 100% !important } .r11-i { padding-top: 15px !important; text-align: center !important } .r12-c { box-sizing: border-box !important; padding-bottom: 15px !important; padding-top: 15px !important; text-align: left !important; valign: top !important; width: 100% !important } .r13-c { background-color: #f6f6f6 !important; box-sizing: border-box !important; padding-bottom: 15px !important; padding-top: 15px !important; text-align: center !important; valign: top !important; width: 100% !important } .r14-c { background-color: transparent !important; box-sizing: border-box !important; text-align: center !important; width: 100% !important } .r15-c { box-sizing: border-box !important; padding: 0 !important; text-align: center !important; valign: top !important; width: 100% !important } .r16-o { border-style: solid !important; margin: 0 auto 0 auto !important; margin-bottom: 15px !important; margin-top: 15px !important; width: 100% !important } .r17-i { padding: 0 !important; text-align: center !important } .r18-r { background-color: #000000 !important; border-color: #000000 !important; border-radius: 4px !important; border-width: 0px !important; box-sizing: border-box; height: initial !important; padding: 0 !important; padding-bottom: 12px !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 12px !important; text-align: center !important; width: 100% !important } body { -webkit-text-size-adjust: none } .nl2go-responsive-hide { display: none } .nl2go-body-table { min-width: unset !important } .mobshow { height: auto !important; overflow: visible !important; max-height: unset !important; visibility: visible !important } .resp-table { display: inline-table !important } .magic-resp { display: table-cell !important } } </style><!--[if !mso]><!--><style type="text/css" emogrify="no">@import url("https://fonts.googleapis.com/css2?family=Inter"); </style><!--<![endif]--><style type="text/css">p, h1, h2, h3, h4, ol, ul, li { margin: 0; } .nl2go-default-textstyle { color: #3b3f44; font-family: Inter, arial; font-size: 16px; line-height: 1.5; word-break: break-word } .default-button { color: #ffffff; font-family: Inter, arial; font-size: 16px; font-style: normal; font-weight: normal; line-height: 1.15; text-decoration: none; word-break: break-word } a, a:link { color: #000000; text-decoration: underline } .default-heading1 { color: #1F2D3D; font-family: Inter, arial; font-size: 36px; word-break: break-word } .default-heading2 { color: #1F2D3D; font-family: Inter, arial; font-size: 32px; word-break: break-word } .default-heading3 { color: #1F2D3D; font-family: Inter, arial; font-size: 24px; word-break: break-word } .default-heading4 { color: #1F2D3D; font-family: Inter, arial; font-size: 18px; word-break: break-word } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } .no-show-for-you { border: none; display: none; float: none; font-size: 0; height: 0; line-height: 0; max-height: 0; mso-hide: all; overflow: hidden; table-layout: fixed; visibility: hidden; width: 0; } </style><!--[if mso]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">a:link{color: #000; text-decoration: underline;}</style></head><body bgcolor="#ffffff" text="#3b3f44" link="#000000" yahoo="fix" style="background-color: #ffffff;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" class="nl2go-body-table" width="100%" style="background-color: #ffffff; width: 100%;"><tr><td> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" align="center" class="r0-o" style="table-layout: fixed; width: 600px;"><tr><td valign="top" class="r1-i" style="background-color: #ffffff;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r4-i" style="background-color: #ffffff; padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r2-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="200" class="r3-o" style="table-layout: fixed; width: 200px;"><tr><td style="font-size: 0px; line-height: 0px;"> <a href="https://todoist-liard-alpha.vercel.app/?utm_source=brevo&utm_campaign=todoist  - otp verification&utm_medium=email" target="_blank" style="color: #000; text-decoration: underline;"> <img src="https://img.mailinblue.com/8035722/images/content_library/original/67a37effdc3c0955a6149da4.png" width="200" title="Go to the app" border="0" style="display: block; width: 100%;"></a> </td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r8-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r9-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r10-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r11-i nl2go-default-textstyle" style="color: #3b3f44; font-family: Inter,arial; font-size: 16px; line-height: 1.5; word-break: break-word; padding-top: 15px; text-align: center;"> <div><h1 class="default-heading1" style="margin: 0; color: #1f2d3d; font-family: Inter,arial; font-size: 36px; word-break: break-word;">Verify Your Email to ${auth} to TodoistNEXT</h1></div> </td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r8-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 10px; padding-right: 10px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r12-c nl2go-default-textstyle" align="left" style="color: #3b3f44; font-family: Inter,arial; font-size: 16px; line-height: 1.5; word-break: break-word; padding-bottom: 15px; padding-top: 15px; text-align: left; valign: top;"> <div><p style="margin: 0;"><span style="font-family: inter, arial;">Hello,<strong>${username}.</strong></span></p><p style="margin: 0;"> </p><p style="margin: 0;"><span style="font-family: inter, arial;">We have received a ${auth} attempt from ${location && `<strong>${location.city}, ${location.countryName}.</strong>`}</span></p><p style="margin: 0;"> </p><p style="margin: 0;"><span style="font-family: inter, arial;">To complete the ${auth} process; enter the 6-digit code in the original window:</span></p></div> </td> </tr><tr><td class="r13-c nl2go-default-textstyle" align="center" style="color: #3b3f44; font-family: Inter,arial; font-size: 16px; word-break: break-word; background-color: #f6f6f6; line-height: 1.5; padding-bottom: 15px; padding-top: 15px; text-align: center; valign: top;"> <div><p style="margin: 0;"><strong>${otp}</strong></p></div> </td> </tr><tr><td height="30" class="r14-c" align="center" style="font-size: 30px; line-height: 30px; background-color: transparent;"> ­ </td> </tr><tr><td class="r15-c" align="center" style="align: center; padding-bottom: 15px; padding-top: 15px; valign: top;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="365" class="r16-o" style="background-color: #000000; border-collapse: separate; border-color: #000000; border-radius: 4px; border-style: solid; border-width: 0px; table-layout: fixed; width: 365px;"><tr><td height="18" align="center" valign="top" class="r17-i nl2go-default-textstyle" style="word-break: break-word; background-color: #000000; border-radius: 4px; color: #ffffff; font-family: Inter, arial; font-size: 16px; font-style: normal; line-height: 1.15; padding-bottom: 12px; padding-left: 5px; padding-right: 5px; padding-top: 12px; text-align: center;"> <a href=${url} class="r18-r default-button" target="_blank" data-btn="1" style="font-style: normal; font-weight: normal; line-height: 1.15; text-decoration: none; word-break: break-word; word-wrap: break-word; display: block; -webkit-text-size-adjust: none; color: #ffffff; font-family: Inter, arial; font-size: 16px;"> <span>Or click here to request new one</span></a> </td> </tr></table></td> </tr><tr><td height="30" class="r14-c" align="center" style="font-size: 30px; line-height: 30px; background-color: transparent;"> ­ </td> </tr><tr><td class="r12-c nl2go-default-textstyle" align="left" style="color: #3b3f44; font-family: Inter,arial; font-size: 16px; line-height: 1.5; word-break: break-word; padding-bottom: 15px; padding-top: 15px; text-align: left; valign: top;"> <div><p style="margin: 0;"><span style="font-family: inter, arial;">If you didn't attempt to ${auth}} but received this email, or if the location doesn't match, please ignore this email. Don't share or forward the 6-digit code with anyone.</span></p></div> </td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table></td> </tr></table></td> </tr></table></body></html>`,
});
