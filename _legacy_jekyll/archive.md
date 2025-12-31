---
layout: page
title: Archive
---

<div class="archive">
  {% for post in site.posts %}
    {% capture post_year %}{{ post.date | date: '%Y' }}{% endcapture %}
    
    {% if post_year != current_year %}
      {% if current_year != null %}
        </ul>
      {% endif %}
      <h3 class="archive-year">{{ post_year }}</h3>
      <ul class="archive-list">
      {% assign current_year = post_year %}
    {% endif %}
    
    <li>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d" }}</time>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ul>
</div>

<style>
.archive-year {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  border-bottom: 2px solid var(--light-bg);
  padding-bottom: 0.5rem;
}

.archive-list {
  list-style: none;
}

.archive-list li {
  padding: 0.5rem 0;
  display: flex;
  gap: 1rem;
}

.archive-list time {
  color: #7f8c8d;
  font-size: 0.9rem;
  min-width: 100px;
}

.archive-list a {
  color: var(--secondary-color);
}

.archive-list a:hover {
  text-decoration: underline;
}
</style>
