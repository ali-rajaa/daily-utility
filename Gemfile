source "https://rubygems.org"

# Plain Jekyll, not the github-pages gem. That gem pins Jekyll 3.10 and
# force-loads jekyll-github-metadata, which is what broke the fixmypcperth
# build. The Actions workflow runs this Jekyll directly instead.
gem "jekyll", "~> 4.4"

# Ruby 3+ no longer bundles webrick, which `jekyll serve` needs locally.
gem "webrick"
