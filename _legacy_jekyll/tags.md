---
layout: page
title: Tags
---

<div class="tags-page">
  {% if site.posts.size > 0 %}
    {% capture tags %}
      {% for post in site.posts %}
        {% for tag in post.tags %}
          {{ tag | slugify }}|{{ tag }}
        {% endfor %}
      {% endfor %}
    {% endcapture %}

    {% assign sorted_tags = tags | split: " " | sort | uniq %}

    {% for tag_pair in sorted_tags %}
      {% assign parts = tag_pair | split: "|" %}
      {% assign tag_slug = parts[0] %}
      {% assign tag_name = parts[1] %}
      
      {% assign tag_count = 0 %}
      {% for post in site.posts %}
        {% if post.tags contains tag_name %}
          {% assign tag_count = tag_count | plus: 1 %}
        {% endif %}
      {% endfor %}

      <div class="tag-item">
        <h3>
          <a href="{{ '/tags/' | relative_url }}#{{ tag_slug }}">{{ tag_name }}</a>
          <span class="tag-count">{{ tag_count }}</span>
        </h3>
        <ul>
          {% for post in site.posts %}
            {% if post.tags contains tag_name %}
              <li>
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
              </li>
            {% endif %}
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  {% else %}
    <p>No tags yet.</p>
  {% endif %}
</div>

<style>
.tag-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--light-bg);
}

.tag-item h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tag-item a {
  color: var(--secondary-color);
}

.tag-count {
  background: var(--light-bg);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.tag-item ul {
  list-style: none;
  padding-left: 0;
}

.tag-item li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  gap: 1rem;
}

.tag-item time {
  color: #7f8c8d;
  font-size: 0.85rem;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .tag-item li {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-item time {
    font-size: 0.8rem;
  }
}
</style>
