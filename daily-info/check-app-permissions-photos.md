---
layout: post
permalink: /daily-info/check-app-permissions-photos
css: post
title: "How to Check Which Apps Can See Your Photos and Files"
description: "How to see which apps can access your photos, files and contacts on Android and iPhone, what each permission means, and how to take access away."
heading: "How to Check Which Apps Can See Your Photos and Files"
category: "Privacy & Security"
date: 2026-09-29
updated: 2026-09-29
read_min: 13
slug: check-app-permissions-photos
glyph: shield
takeaways:
  - "Both Android and iPhone let you see and change which apps can access your photos, files and contacts."
  - "Where you can, give apps access to selected photos only, rather than your whole library."
  - "Be especially careful with all-files access, accessibility access and notification access."
  - "A quick permissions check-up every few months keeps access limited to the apps that need it."
faqs:
  - q: "Can an app see my photos without asking?"
    a: "On current versions of Android and iOS, an app needs your permission to read your photo library. Apps can, however, let you pick individual photos through the system photo picker, which gives them only the photos you choose, without broad access."
  - q: "What's the difference between full and limited photo access?"
    a: "Full access lets an app see every photo and video in your library, including new ones. Limited or selected access lets it see only the photos you've chosen. Limited access is the better choice for apps that only need the occasional picture."
  - q: "Will an app stop working if I remove its photo access?"
    a: "Features that need your photos, such as uploading a picture, will ask for access again or offer a picker. The rest of the app usually works normally. You can always grant access again in your phone's settings."
  - q: "Do backup apps need full access to my photos?"
    a: "A photo backup app needs access to the photos it's backing up, and to back up your whole library it needs access to all of it. That's a reasonable request from an app whose job is backing up your photos; the same request from an app with no obvious need for it deserves a closer look."
related:
  - backup-vs-sync
  - move-photos-android-to-iphone
  - where-deleted-photos-go-android
og_image: "/assets/og/check-app-permissions-photos.jpg"
og_image_alt: "How to Check Which Apps Can See Your Photos and Files: a Daily Info guide from Daily Utility Apps"
---

Every time you install an app, there's a good chance it asks for something: access to your photos, your files, your contacts, your camera or your location. It's easy to tap "Allow" to get past the prompt and get on with using the app. Over months and years, that adds up to dozens of apps with access to some of the most personal information on your phone.

Most of those apps are harmless and use the access for exactly what you'd expect. But some ask for more than they need, some you no longer use, and some you'd never have allowed if you'd stopped to think. Both Android and iPhone let you see which apps can access what, and take access away.

This guide explains what app permissions are, how photo and file access works on each platform, how to check and change it, and which permissions deserve the most care.

## What app permissions are

A permission is your phone's way of asking you before an app can reach something sensitive. Apps are kept separate from each other and from your personal data by default. To read your photos, see your contacts, use your camera or know where you are, an app has to ask, and you decide.

Permissions protect you in two ways. First, they make apps ask, so nothing sensitive is shared without your knowledge. Second, they let you change your mind: a permission you granted once can be removed at any time in your phone's settings.

A permission doesn't tell you everything, though. It controls whether an app can *access* something on your phone. It doesn't, by itself, tell you what the app does with that data afterwards: whether it stays on your phone, is uploaded, or is shared. That's where an app's privacy information comes in, covered later in this guide.

## How photo access works

Photo access has become much more fine-grained in recent years on both platforms, which means you have more options than yes or no.

### On iPhone

When an app asks for access to your photos, an iPhone typically offers these choices:

- **Full Access** lets the app see your whole photo and video library, including new photos you take later.
- **Limited Access** lets the app see only the photos you select. You can change the selection at any time.
- **None** means the app can't read your library at all.

Some apps only need to *save* photos, not read them, such as a camera app or an editing app exporting a picture. For these, iPhones offer an **Add Photos Only** option, which lets the app add photos without seeing the rest of your library.

### On Android

Recent versions of Android have moved in the same direction:

- Android 13 split media access into separate permissions for **photos and videos** and for **audio**, instead of one broad storage permission.
- Android 14 added the option to **allow limited access**, letting an app see only the photos and videos you select.
- Many apps now use the **Android photo picker**, which lets you choose specific photos to share with an app without granting it any ongoing access to your library at all.

On older Android versions, apps often used a broader **storage** permission, which covered photos along with other files. If your phone runs an older version, that broader permission is what you'll see.

## Check photo access on iPhone

To see which apps can access your photos on an iPhone:

1. Open **Settings**.
2. Tap **Privacy & Security**.
3. Tap **Photos**.

You'll see a list of every app that has asked for photo access, with its current level shown next to it: Full Access, Limited Access, Add Photos Only or None. Tap any app to change it.

For apps with Limited Access, you can also tap **Edit Selected Photos** to review exactly which photos that app can see, and add or remove photos from its selection.

The same Privacy & Security screen lists other sensitive areas, including **Contacts**, **Camera**, **Microphone** and **Location Services**, each with its own list of apps. On recent versions of iOS, contacts access also offers a limited option, letting you share selected contacts rather than your whole address book.

## Check photo and file access on Android

Menu names vary a little between phone makers and Android versions, but there are two main ways to check.

### By permission

This shows every app with a particular type of access.

1. Open **Settings**.
2. Look for **Security & privacy**, **Privacy** or similar, then **Permission manager** (on some phones it's under Apps, then Permission manager).
3. Tap **Photos and videos** (or **Files and media** or **Storage** on older versions).

You'll see apps grouped by whether they're allowed all the time, allowed limited access, or not allowed. Tap any app to change its access.

### By app

This shows every permission a particular app has.

1. Open **Settings**, then **Apps**.
2. Choose the app.
3. Tap **Permissions**.

This is the quickest way to review an app you're unsure about, since it shows everything that app can access in one place.

## Special access that deserves extra care

Beyond the everyday permissions, Android has a category of special app access for more powerful abilities. These are worth checking closely, because they can give an app far more reach than a normal permission. You'll usually find them in Settings, under Apps, then **Special app access**.

- **All files access** lets an app read and change almost every file on your phone's shared storage, not just photos. It's legitimately needed by file managers and some backup tools, but few other apps need it.
- **Accessibility** services can see what's on your screen and act on your behalf. They're essential for people who use assistive technology, but they're also powerful enough to be misused. Only allow apps you trust and whose purpose requires it.
- **Notification access** lets an app read all your notifications, which can include message previews, one-time codes and other private information.
- **Device admin apps** have extra control over your phone, typically used for work management or finding a lost phone.
- **Install unknown apps** lets an app install other apps from outside the Play Store. Keep this turned off for everything except apps you deliberately use for that purpose.
- **Display over other apps** lets an app draw on top of other apps. It has legitimate uses, like chat bubbles, but can also be used to disguise what's on screen.

If an app has any of these and you can't think of a good reason why, remove it.

## Files and documents

Access to documents and other files works differently from photos.

On iPhone, apps can't browse your files freely. When an app needs a document, you choose it through the system **Files** picker, and the app only gets the file you selected. This is why you rarely see a general "files" permission on an iPhone.

On Android, modern apps are also encouraged to use a system file picker, where you choose the file to share. Apps that need wider access use the broader permissions or the special **all files access** described above. File managers and some backup apps have good reasons to ask for it; a game or a flashlight app doesn't.

## Location hidden inside your photos

Photo permissions aren't the only way your photos can reveal more than you intend. Most phones store extra information inside each photo file, including the date and time, the phone model and, if location was turned on for the camera, the exact place the photo was taken.

That location data is useful for you: it's how your phone groups photos by place and lets you search for "photos in Paris". But when you share a photo, the location can travel with it, and anyone who receives the original file may be able to see where it was taken, including your home.

You have a few options:

- Remove location when sharing. On an iPhone, the share screen has an **Options** button at the top, where you can turn off location for that share. In Google Photos, there's a setting to remove location information from photos you share by link.
- Turn off location for the camera. You can stop the camera saving location altogether in your phone's location or camera settings. You'll lose place-based search for new photos, so it's a trade-off.
- Know how your chat apps handle it. Many messaging and social apps strip location information from photos when they're sent, but not all do, especially when photos are sent as files rather than as pictures.

## What happens when you say no

It's natural to worry that denying a permission will break an app. A well-built app copes with a refusal.

If you deny photo access, the app can't read your library, but it can usually still offer the system photo picker when you want to share a specific picture. If you deny camera access, features that need the camera will ask again or explain that they can't work. Everything else in the app should carry on as normal.

You're never locked into a choice. If you deny a permission and later find a feature you want, you can grant it in your phone's settings at any time. And if an app keeps asking for a permission after you've said no, repeatedly and without explanation, that tells you something about how it treats your choices.

## Children's and shared phones

If you look after a child's phone, or share a device within a family, permissions deserve a little more attention.

Both platforms offer family tools that help. On iPhone, **Family Sharing** and **Screen Time** let parents approve app downloads and restrict which apps can make changes to privacy settings. On Android, **Google Family Link** lets parents approve apps and manage the permissions they have on a child's device.

Whatever tools you use, the same principles apply: review which apps can access photos, camera, microphone and location, prefer limited access over full access, and talk with children about why an app asking for their photos or contacts is worth a second thought.

## Other permissions to review

While you're checking photos and files, look at the other sensitive permissions too.

- Contacts. Apps that ask for your contacts can see names, numbers and email addresses of everyone you know, not just your own information. Messaging and calling apps have obvious reasons; many other apps don't.
- Camera and microphone. Both platforms show an indicator (a small coloured dot or icon) when the camera or microphone is in use. If you notice it when you don't expect it, check which app is responsible.
- Location. Location access can usually be limited to **while using the app** rather than all the time, and both platforms let you share an approximate rather than precise location. Very few apps need your precise location all the time.

## Use the privacy dashboards

Both platforms include tools that show which apps have recently used your data, as well as which ones can.

- On Android, the **Privacy dashboard** (in Settings, under Security & privacy or Privacy) shows which apps have used sensitive permissions, such as location, camera and microphone, over the last day or so, on a timeline.
- On iPhone, the **App Privacy Report** (in Settings, under Privacy & Security, near the bottom) can be turned on to record how often apps access data such as your photos, contacts, camera, microphone and location, and which web domains they contact.

These are useful for spotting surprises: an app that uses your location far more often than you'd expect, or one that accesses your photos when you haven't opened it.

## Let your phone tidy up unused apps

Apps you no longer use can keep their permissions indefinitely, unless your phone steps in. Android can automatically remove permissions from apps you haven't used for a few months. On many phones, this option is called something like **Pause app activity if unused** or **Remove permissions if app is unused**, found on each app's settings page, and it's turned on by default for most apps.

Even with this in place, deleting apps you no longer use is the cleanest solution. An app that isn't installed can't access anything.

## Read an app's privacy information

Permissions tell you what an app can reach on your phone. To understand what it does with that data, look at its privacy information in the app store before you install it, or afterwards if you're unsure.

- On the App Store, each app's page has an **App Privacy** section summarising the data the app collects and how it's used, as reported by the developer.
- On Google Play, each app's page has a **Data safety** section describing what data is collected and shared, whether it's encrypted in transit, and whether you can ask for it to be deleted.

Also check the app's own privacy policy, usually linked from its store page. A good one explains in plain language what the app collects, why, where it's stored and who it's shared with.

## Signs an app is asking for too much

Ask whether a permission makes sense for what the app does. A photo editor asking for your photos is expected. A calculator asking for your contacts is not.

Be cautious when:

- An app asks for access unrelated to its purpose, such as a torch app wanting your location or a game wanting your contacts.
- An app won't work at all without broad access it doesn't obviously need.
- An app asks for special access, like accessibility or notification access, without a clear explanation of why.
- An app asks for everything at once the first time it opens, before you've used any feature that needs it.

Well-designed apps usually ask for a permission at the moment you use a feature that needs it, and explain why. That's a good sign.

## When you don't recognise an app

Sometimes a permissions list includes an app you don't remember installing. Don't panic: it's often a pre-installed app from your phone maker or mobile provider, or something installed alongside another app.

Tap the app's name to see its details, and search for it by name if you're unsure what it is. If it's a system app you can't remove, you can usually still turn off permissions it doesn't need. If it's an app you didn't install and can't identify, remove it, and consider running a security check using the tools built into your phone, such as Google Play Protect on Android.

## A quick privacy check-up routine

You don't need to think about permissions every day. A short check-up every few months keeps things under control:

1. Review photo access and switch apps to limited access or none where full access isn't needed.
2. Review contacts, location, camera and microphone in the same way.
3. Check special app access on Android, especially all files, accessibility and notification access.
4. Look at the privacy dashboard or App Privacy Report for anything unexpected.
5. Delete apps you no longer use.

It takes about ten minutes, and it leaves your photos, files and contacts visible only to the apps you chose.

## Permissions and backups

A photo backup app needs access to the photos it backs up; to back up your whole library, it needs access to all of it. It is a clear case of an app with a real reason for full photo access. The question to ask is always the same: does this app need this access to do the job I installed it for? If it does, and you trust it, allow it. If it doesn't, don't.

<aside class="post-note" markdown="1">

We don't sell your private files, photos, videos, documents or contacts, and we only use them to provide the features you ask for. Our [privacy policy]({{ '/privacy-policy' | relative_url }}) explains exactly how your data is handled.

</aside>
