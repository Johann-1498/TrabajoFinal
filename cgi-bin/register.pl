#!"C:\xampp\perl\bin\perl.exe"
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use JSON;
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
my $token_sesion = "a5c3787d2eef7c4bcf3d37b5b1512a5"; # Debes ajustar esto
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass)
  or die "No se pudo conectar a la base de datos: $DBI::errstr";
my $sql = "INSERT INTO $table (name, email, password, telefono, cui, token_sesion) VALUES (?, ?, ?, ?, ?, ?)";
my $sth = $dbh->prepare($sql);
$sth->execute($name, $email, $password, $telefono, $cui, $token_sesion);
$dbh->disconnect;
# Configura una cookie con el token de sesión
my $cookie = CGI::Cookie->new(
    -name    => 'token_sesion',
    -value   => $token_sesion,
    -expires => '+1d', # Puedes ajustar la vigencia de la cookie según tus necesidades
);
# Envía la cookie al cliente
print $cgi->header(-cookie => $cookie, -type => 'text/html', -status => '302 Found', -location => '../index.html');