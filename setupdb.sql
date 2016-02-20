CREATE TABLE tblRegistration (RegID int(11) PRIMARY KEY AUTO_INCREMENT, UserName varchar(100) NOT NULL, Password varchar(20) NOT NULL);

CREATE TABLE tblImage (RegId int(11) PRIMARY KEY AUTO_INCREMENT, ImageName varchar(200) NOT NULL, Date DATE NOT NULL, `Time` TIME NOT NULL , DayOfWeek varchar(10) NOT NULL, Latitude varchar(100) NOT NULL, Longitude varchar(100) NOT NULL, ImageRate int(5) NOT NULL, ImageFile varchar(200) NOT NULL, ImageRequestTime DATETIME, city varchar(200) NOT NULL, state varchar(200) NOT NULL);
