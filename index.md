---
layout: default
---

<section class="home">
  <h2>Recent Posts</h2>
  
  {% if site.posts.size > 0 %}
    <ul class="post-list">
      {% for post in site.posts limit:10 %}
        <li class="post-item">
          <a href="{{ post.url | relative_url }}" class="post-link">
            {{ post.title }}
          </a>
          <time datetime="{{ post.date | date_to_xmlschema }}" class="post-date">
            {{ post.date | date: "%B %d, %Y" }}
          </time>
          {% if post.excerpt %}
            <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
          {% endif %}
          {% if post.tags %}
            <div class="post-tags">
              {% for tag in post.tags %}
                <a href="{{ '/tags/' | relative_url }}#{{ tag | slugify }}" class="tag">{{ tag }}</a>
              {% endfor %}
            </div>
          {% endif %}
        </li>
      {% endfor %}
    </ul>

    {% if site.posts.size > 10 %}
      <div style="text-align: center; margin-top: 2rem;">
        <a href="{{ '/archive/' | relative_url }}" class="btn" style="padding: 0.75rem 1.5rem; background: var(--secondary-color); color: white; border-radius: 4px; display: inline-block;">
          View All Posts
        </a>
      </div>
    {% endif %}
  {% else %}
    <p>No posts yet. Check back soon!</p>
  {% endif %}
</section>
