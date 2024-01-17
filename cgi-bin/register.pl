#!"C:\xampp\perl\bin\perl.exe"
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use JSON;
use Digest::SHA qw(sha1_hex);
my $db_name   = 'trabajofinal';
my $db_user   = 'root';
my $db_pass   = '';
my $db_host   = 'localhost';
my $table     = 'users';
sub generar_token_sesion {
    my $tiempo_actual = time();
    my $token = sha1_hex($tiempo_actual, rand());  # Usando sha1_hex de Digest::SHA

    return $token;
}
my $token_sesion = generar_token_sesion();
my $cgi = CGI->new;
my $name = $cgi->param('name');
my $password = $cgi->param('password');
my $email  = $cgi->param('email');
my $telefono  = $cgi->param('telefono');
my $cui  = $cgi->param('cui');
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass)
  or die "No se pudo conectar a la base de datos: $DBI::errstr";
my $sql = "INSERT INTO $table (name, email, password, telefono, cui, token_sesion) VALUES (?, ?, ?, ?, ?, ?)";
my $sth = $dbh->prepare($sql);
$sth->execute($name, $email, $password, $telefono, $cui, $token_sesion);
$dbh->disconnect;
my $cookie = CGI::Cookie->new(
    -name    => 'token_sesion',
    -value   => $token_sesion,
    -expires => '+1d',
);
print $cgi->header(-cookie => $cookie, -type => 'text/html', -status => '302 Found', -location => '../index.html');