#!"C:\xampp\perl\bin\perl.exe"
use strict;
use warnings;
use CGI;
use DBI;
my $db_name   = 'trabajofinal';
my $db_user   = 'root';
my $db_pass   = '';
my $db_host   = 'localhost';
my $table     = 'users';
my $cgi = CGI->new;
my $name = $cgi->param('name');
my $password = $cgi->param('password');
my $email  = $cgi->param('email');
my $telefono  = $cgi->param('telefono');
my $cui  = $cgi->param('cui');
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass)
  or die "No se pudo conectar a la base de datos: $DBI::errstr";
my $sql = "INSERT INTO $table (name, email, password, telefono, cui) VALUES (?, ?, ?, ?, ?)";
my $sth = $dbh->prepare($sql);
$sth->execute($name, $email, $password, $telefono, $cui);
$dbh->disconnect;
print $cgi->redirect("../index.html");