USE voxlingo_db;

INSERT INTO lessons (language, level, theme, title, image_url, order_index) VALUES
('anglais', 'débutant', 'salutations', 'Se présenter', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', 1),
('anglais', 'débutant', 'nourriture', 'Au restaurant', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 2),
('anglais', 'intermédiaire', 'voyage', 'À l''aéroport', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400', 3);

INSERT INTO phrases (lesson_id, text_target, text_translation, order_index) VALUES
(1, 'Hello, my name is John', 'Bonjour, je m''appelle John', 1),
(1, 'Nice to meet you', 'Ravi de vous rencontrer', 2),
(1, 'How are you today', 'Comment allez-vous aujourd''hui', 3),
(2, 'Can I see the menu please', 'Puis-je voir le menu s''il vous plaît', 1),
(2, 'I would like a coffee', 'Je voudrais un café', 2),
(3, 'Where is the boarding gate', 'Où est la porte d''embarquement', 1);