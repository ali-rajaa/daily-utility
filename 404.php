<?php
// Answers every address that doesn't exist (the last rule in .htaccess):
// a real 404 status with the site's own not-found page. This host's
// server-wide error page can't be replaced from .htaccess, so
// ErrorDocument alone showed Apache's default page (STATUS.md 5w).
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
readfile(__DIR__ . '/404.html');
