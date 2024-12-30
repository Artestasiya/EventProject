-- ������� City
INSERT INTO [Event].[dbo].[City] ([name]) VALUES 
('�����'),
('������'),
('������'),
('�������'),
('������'),
('�����'),
('��������'),
('�����������'),
('�����'),
('����');

-- ������� Place
INSERT INTO [Event].[dbo].[Place] ([name], [id_city]) VALUES 
('����� �����', 1),
('������ ����������', 1),
('����������� ���������� ��������', 1),
('���������� ������ ��������', 2),
('���������� ���������� ���', 3),
('��������� ��������������� ���������� ���', 4),
('����������� ������������� �����', 5),
('��������� ����� �����', 6),
('������� ������������� �����', 9),
('��������� ���������� �����', 10);

-- ������� Category
INSERT INTO [Event].[dbo].[Category] ([name], [description]) VALUES 
('�������', '����������� �����������, �������������� ��� ��������'),
('����������� �������������', '��������� ��� ����������� ����������'),
('��������', '����������� ��� ������������ ������������ ��������� ��� ������ ��������'),
('�������', '������� ����������� � ����� ���������� ����������� ����'),
('������-�����', '������������ �������� ��� ������������ ��������'),
('���������', '�������� ������ � ���������� ��� ������ �����'),
('���������� �����������', '������������ ��� ������������ ���������� �������'),
('���������', '���������� ��� ��������������� �����������, ����� ������������'),
('������', '��������������� ����������� �� ����������� ����'),
('������������ ���������', '����������� � ������� ��� ����������� �������������');

-- ������� Events
INSERT INTO [Event].[dbo].[Events] ([name], [description], [date], [id_place], [id_category], [max_amount], [image]) VALUES 
('New Year Party', 'New Year''s Eve party Dress Code : New Year''s Eve Don''t forget to bring a gift!', '2024-12-31 14:00:00.000', 6, 11, 30, 'https://avatars.mds.yandex.net/i?id=9ee2d24f66655e5a2d3e67e683c7d9a8_l-4819109-images-thumbs&n=13'),
('����� "����� ������"', '�������� ������ ����� "����� �������". ������� ������ �� 25 ����� �� ������. ��������� ������ 12 �.', '2024-12-19 14:00:00.000', 5, 7, 120, 'https://sun9-31.userapi.com/s/v1/ig2/piRL-QiFGjdfstQGnMabGtz_7VSPYC6VeRL_ispDtpJn8C82Lmam7F-W1dE5f_9B09RMjYCNTvpFJA7RGVIGx41e.jpg?quality=95'),
('������� ���', '��� � ������� ��������� � ������!', '2025-03-28 17:00:00.000', 1, 2, 4500, 'https://www.kvitki.by/imageGenerator/eventDetails/eb5807f05fe5ccc7b54ff959ce59fdbb'),
('�������� ����������� ����������', '�������� ���������� �������� � �������� ����������� ��������.', '2024-12-20 11:00:00.000', 4, 4, 200, 'https://example.com/art_exhibition.jpg'),
('����������� ���������� "����� � ���������"', '������������ ���������� � ����������� ����������.', '2024-12-22 19:00:00.000', 7, 3, 300, 'https://example.com/romeo_and_juliet.jpg');

-- ������� Member
INSERT INTO [Event].[dbo].[Member] ([id_member], [name], [surname], [Email], [data_birth]) VALUES 
(1, '�����', '�������', 'artemio@gmail.com', '2004-04-18'),
(2, 'Admin', 'Admin', 'admin@gmail.com', '2005-04-18');

-- ������� Loggin
INSERT INTO [Event].[dbo].[Loggin] ([id_loggin], [email], [password], [role]) VALUES 
(1, 'artemio@gmail.com', '$2a$10$GdbtsZ5G8FY/hpyTue8y.ey/QftZiJxBHJLRJofESiIQZApYZXlO.', 0),
(2, 'admin@gmail.com', '$2a$10$GS59/YvL3hESs0jWsNmTFOKi4Dkk.EWXjwYwBD1hoFr2rV4ViaCDm', 1);

-- ������� Member_event
INSERT INTO [Event].[dbo].[Member_event] ( [id_event], [id_member], [reg_date]) VALUES 
(1, 1, '2024-12-24 22:53:21.616'),
(3, 1, '2024-12-25 11:44:15.266');
