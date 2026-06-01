export const mapRecommendationPayload = (payload) => {
  if (!payload || !Array.isArray(payload.recommendations)) {
    return [];
  }

  return payload.recommendations.map((item) => {
    const course = item.course || {};
    const score = item.similarity_score ?? 0;

    let tags = [];
    if (Array.isArray(course.tags)) {
      tags = course.tags;
    } else if (typeof course.tags === 'string') {
      try {
        tags = JSON.parse(course.tags);
      } catch {
        tags = course.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      }
    }

    const skills = course.skills || '';

    return {
      id: course.id,
      title: course.title || 'Untitled',
      description: course.description || '',
      category: course.category || 'General IT',
      level: course.level || 'Pemula',
      duration: course.duration_text || (course.duration_minutes ? `${course.duration_minutes} menit` : '-'),
      tags,
      externalUrl: course.external_url || '#',
      source: extractSource(course.external_url),
      relevanceScore: Math.round(score * 100),
      reason: `Direkomendasikan berdasarkan kecocokan konten${skills ? ': ' + skills : ''}.`,
      summary: course.summary || '',
      learningPoints: course.learning_points || '',
    };
  });
};

const extractSource = (url) => {
  if (!url) return 'Brainpath';

  try {
    const host = new URL(url).hostname.replace('www.', '');
    const map = {
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'udemy.com': 'Udemy',
      'coursera.org': 'Coursera',
      'freecodecamp.org': 'freeCodeCamp',
      'codecademy.com': 'Codecademy',
      'kaggle.com': 'Kaggle',
    };

    return map[host] || host;
  } catch {
    return 'Brainpath';
  }
};
